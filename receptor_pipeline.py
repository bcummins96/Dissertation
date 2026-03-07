import os
import subprocess
import numpy as np

from pdbfixer import PDBFixer
from openmm.app import PDBFile, Simulation, ForceField
from openmm import LangevinIntegrator
from openmm.unit import *

################################################
# SETTINGS
################################################

pdb_id = "6WGT"
chain_keep = "A"
ligand_resname = "LIG"

box_size = 22

################################################
# STEP 1 — DOWNLOAD PDB
################################################

def download_pdb():
    import urllib.request

    url = f"https://files.rcsb.org/download/{pdb_id}.pdb"
    urllib.request.urlretrieve(url, "receptor_raw.pdb")

################################################
# STEP 2 — FIX STRUCTURE
################################################

def repair_structure():

    fixer = PDBFixer(filename="receptor_raw.pdb")

    fixer.removeHeterogens(keepWater=False)

    fixer.findMissingResidues()
    fixer.findMissingAtoms()
    fixer.addMissingAtoms()

    fixer.addMissingHydrogens(pH=7.4)

    PDBFile.writeFile(
        fixer.topology,
        fixer.positions,
        open("receptor_fixed.pdb","w")
    )

################################################
# STEP 3 — KEEP TARGET CHAIN
################################################

def isolate_chain():

    with open("receptor_fixed.pdb") as fin, open("receptor_clean.pdb","w") as fout:

        for line in fin:
            if line.startswith("ATOM") and f" {chain_keep} " in line:
                fout.write(line)

################################################
# STEP 4 — MINIMIZE STRUCTURE
################################################

def minimize():

    pdb = PDBFile("receptor_clean.pdb")

    forcefield = ForceField("amber14-all.xml")

    system = forcefield.createSystem(
        pdb.topology,
        nonbondedMethod=None
    )

    integrator = LangevinIntegrator(
        300*kelvin,
        1/picosecond,
        0.002*picoseconds
    )

    simulation = Simulation(
        pdb.topology,
        system,
        integrator
    )

    simulation.context.setPositions(pdb.positions)

    print("Minimizing receptor...")
    simulation.minimizeEnergy()

    positions = simulation.context.getState(
        getPositions=True
    ).getPositions()

    PDBFile.writeFile(
        pdb.topology,
        positions,
        open("receptor_minimized.pdb","w")
    )

################################################
# STEP 5 — CONVERT TO PDBQT
################################################

def make_pdbqt():

    subprocess.run([
        "prepare_receptor4.py",
        "-r","receptor_minimized.pdb",
        "-o","receptor.pdbqt",
        "-A","checkhydrogens"
    ])

################################################
# STEP 6 — FIND LIGAND CENTER
################################################

def get_box_center():

    coords = []

    with open("receptor_raw.pdb") as f:
        for line in f:

            if line.startswith("HETATM") and ligand_resname in line:

                x = float(line[30:38])
                y = float(line[38:46])
                z = float(line[46:54])

                coords.append([x,y,z])

    coords = np.array(coords)

    center = coords.mean(axis=0)

    return center

################################################
# STEP 7 — PREPARE LIGANDS
################################################

def prepare_ligands():

    ligands = os.listdir("ligands")

    for lig in ligands:

        name = lig.split(".")[0]

        subprocess.run([
            "obabel",
            f"ligands/{lig}",
            "-O",
            f"{name}.pdbqt",
            "--gen3d",
            "-p",
            "7.4"
        ])

################################################
# STEP 8 — RUN DOCKING
################################################

def dock(center):

    cx,cy,cz = center

    ligands = [x for x in os.listdir() if x.endswith(".pdbqt") and x!="receptor.pdbqt"]

    for lig in ligands:

        out = lig.replace(".pdbqt","_dock.pdbqt")

        subprocess.run([
            "vina",
            "--receptor","receptor.pdbqt",
            "--ligand",lig,
            "--center_x",str(cx),
            "--center_y",str(cy),
            "--center_z",str(cz),
            "--size_x",str(box_size),
            "--size_y",str(box_size),
            "--size_z",str(box_size),
            "--out",out,
            "--exhaustiveness","16"
        ])

################################################
# RUN PIPELINE
################################################

if __name__ == "__main__":

    download_pdb()

    repair_structure()

    isolate_chain()

    minimize()

    make_pdbqt()

    center = get_box_center()

    prepare_ligands()

    dock(center)

    print("Docking pipeline complete.")
