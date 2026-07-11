const mongoose = require("mongoose");

const securityLogSchema = new mongoose.Schema(
    {
        requestId: {
            type: String,
            required: true,
            unique: true
        },

        user: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                default: null
            },
            email: {
                type: String,
                default: null
            }
        },

        ipAddress: {
            type: String,
            default: null
        },

        userAgent: {
            type: String,
            default: null
        },

        prompt: {
            type: String,
            required: true
        },

        status: {
            type: String,
            enum: ["allowed", "blocked"],
            required: true
        },

        riskScore: {
            type: Number,
            default: 0
        },

        attackCategory: {
            type: String,
            enum: [
                "safe",
                "prompt_injection",
                "jailbreak",
                "system_prompt_leak",
                "secret_extraction",
                "role_manipulation",
                "other"
            ],
            default: "safe"
        },

        aiDecision: {
            type: Object,
            default: null
        },

        triggeredRules: [
            {
                type: String
            }
        ],

        analysisDuration: {
            type: Number,
            default: 0
        },

        action: {
            type: String,
            enum: ["forwarded", "blocked"],
            required: true
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("SecurityLog", securityLogSchema);