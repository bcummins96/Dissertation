#this compares two pdb files, runs normal mode analysis and quantitatively compares 
#mode overlap matrix and delta fluctuation profiles with visual representation. designed to compare
#a wild type receptor to a mutated version, also works with different conformations of the same receptor

from prody import *
import numpy as np
import matplotlib.pyplot as plt

# ============================
# USER INPUT
# ============================
wt_pdb  = "inputfirstreceptor.pdb"
mut_pdb = "inputsecondreceptor.pdb"
n_modes = 20          # compute first 20 modes
compare_modes = 6     # compare first 6 (functionally relevant)

# ============================
# LOAD STRUCTURES
# ============================
wt = parsePDB(wt_pdb)
mut = parsePDB(mut_pdb)

# Select Cα atoms
wt_ca  = wt.select("protein and name CA")
mut_ca = mut.select("protein and name CA")

if wt_ca.numAtoms() != mut_ca.numAtoms():
    raise ValueError("WT and mutant have different numbers of CA atoms!")

print(f"CA atoms: {wt_ca.numAtoms()}")

# ============================
# ALIGN STRUCTURES
# ============================
# Align mutant onto WT to remove rigid-body differences
transformation = calcTransformation(mut_ca, wt_ca)
transformation.apply(mut)

# ============================
# BUILD ANMs
# ============================
anm_wt = ANM("WT_ANM")
anm_wt.buildHessian(wt_ca)
anm_wt.calcModes(n_modes=n_modes)

anm_mut = ANM("MUT_ANM")
anm_mut.buildHessian(mut_ca)
anm_mut.calcModes(n_modes=n_modes)

print("ANMs calculated.")

# ============================
# MODE OVERLAP ANALYSIS
# ============================
overlap_matrix = calcOverlap(
    anm_wt[:compare_modes],
    anm_mut[:compare_modes]
)

print("\nMode overlap matrix (WT vs MUT):")
print(overlap_matrix)

# Plot overlap heatmap
plt.imshow(overlap_matrix, cmap="viridis")
plt.colorbar(label="Mode overlap")
plt.xlabel("Mutant modes")
plt.ylabel("WT modes")
plt.title("ANM Mode Overlap (WT vs Mutant)")
plt.show()

# ============================
# FLUCTUATION COMPARISON
# ============================
# Use lowest-frequency mode (mode 1)
fluct_wt  = calcSqFlucts(anm_wt[0])
fluct_mut = calcSqFlucts(anm_mut[0])

delta_fluct = fluct_mut - fluct_wt

plt.figure(figsize=(10,4))
plt.plot(delta_fluct)
plt.axhline(0, color="black", linestyle="--")
plt.xlabel("Residue index (CA)")
plt.ylabel("Δ Fluctuation (Mutant - WT)")
plt.title("Change in Flexibility (Mode 1)")
plt.show()

# ============================
# SAVE RESULTS
# ============================
np.savetxt("mode_overlap_matrix.txt", overlap_matrix)
np.savetxt("delta_fluctuations.txt", delta_fluct)

print("Analysis complete. Results saved.")
