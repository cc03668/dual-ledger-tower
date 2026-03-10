pragma circom 2.0.0;

include "circomlib/circuits/comparators.circom";
include "circomlib/circuits/poseidon.circom";

template SavingsProof() {
    signal input income;      // private: income * 100 (integer cents)
    signal input expense;     // private: expense * 100 (integer cents)
    signal input salt;        // private: random salt for commitment

    signal output commitment; // public: Poseidon(income, expense, salt)

    // Constraint: income > expense
    component gt = GreaterThan(64); // 64-bit values (enough for large amounts)
    gt.in[0] <== income;
    gt.in[1] <== expense;
    gt.out === 1;

    // Commitment: binds proof to specific values
    component hasher = Poseidon(3);
    hasher.inputs[0] <== income;
    hasher.inputs[1] <== expense;
    hasher.inputs[2] <== salt;
    commitment <== hasher.out;
}

component main = SavingsProof();
