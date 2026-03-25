import os
import subprocess

# input receptor
input_pdb = "receptor_raw.pdb"
clean_pdb = "receptor_clean.pdb"
output_pdbqt = "receptor.pdbqt"

def clean_pdb(infile, outfile):
    """
    Remove water and heteroatoms except cofactors if needed
    """
    with open(infile) as fin, open(outfile, "w") as fout:
        for line in fin:
            if line.startswith("ATOM"):
                fout.write(line)

def add_hydrogens(infile, outfile):
    """
    Add hydrogens using Open Babel
    """
    subprocess.run([
        "obabel",
        infile,
        "-O", outfile,
        "-h"
    ])

def prepare_pdbqt(infile, outfile):
    """
    Convert to pdbqt using AutoDockTools
    """
    subprocess.run([
        "prepare_receptor4.py",
        "-r", infile,
        "-o", outfile,
        "-A", "checkhydrogens"
    ])

print("Cleaning PDB...")
clean_pdb(input_pdb, clean_pdb)

print("Adding hydrogens...")
add_hydrogens(clean_pdb, clean_pdb)

print("Generating PDBQT...")
prepare_pdbqt(clean_pdb, output_pdbqt)

print("Receptor preparation complete.")
