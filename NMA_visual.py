#This generates nmd files for normal mode visualization of a protein receptor PDB file
#using the prepared structure file (without ligand)


from prody import *
import numpy as np

# -----------------------------
# 1. Load PDB
# -----------------------------
pdb_file = 'insertfilenamehere.pdb'
structure = parsePDB(pdb_file)

print("Chains found:", set(structure.getChids()))

# -----------------------------
# 2. Select receptor CA atoms
# -----------------------------
# Common GPCR case: single chain (often A)
ca = structure.select("protein and name CA")

if ca is None:
    raise ValueError("CA selection failed – check PDB contents")

print("Number of CA atoms:", ca.numAtoms())

# -----------------------------
# 3. Build ANM
# -----------------------------
anm = ANM("Receptor_ANM")
anm.buildHessian(ca)      # default cutoff = 15 Å
anm.calcModes(n_modes=20)

print(anm)

# -----------------------------
# 4. Save modes for visualization
# -----------------------------
writeNMD("Receptor_ANM.nmd", anm, ca)

print("ANM calculation complete.")
