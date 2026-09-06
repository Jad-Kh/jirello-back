import { describe, expect, it } from "vitest";
import { DeliverableModel } from "../src/database/models/portal/Deliverable.js";
import { ProjectFinanceModel } from "../src/database/models/finance/ProjectFinance.js";
import { TimeEntryModel } from "../src/database/models/time/TimeEntry.js";
import { WorkConfigurationModel } from "../src/database/models/work/WorkConfiguration.js";

describe("expanded business domains", () => {
    it("validates configurable work types", () => {
        const configuration = new WorkConfigurationModel({
            communityId: "507f191e810c19729de860ea",
            key: "client-request",
            name: "Client request",
            statuses: [
                { key: "new", name: "New", category: "todo", position: 0 },
                { key: "approved", name: "Approved", category: "done", position: 1 },
            ],
            fields: [{ key: "budget", label: "Budget", type: "currency", required: false, options: [] }],
            transitions: [{ from: "new", to: "approved" }],
        });
        expect(configuration.validateSync()).toBeUndefined();
        expect(configuration.version).toBe(1);
    });

    it("stores time and project finance values as integer minor currency units", () => {
        const entry = new TimeEntryModel({
            communityId: "507f191e810c19729de860ea",
            userId: "507f1f77bcf86cd799439011",
            startedAt: new Date(),
            durationMinutes: 90,
            billable: true,
            billingRateCents: 12500,
            currency: "USD",
        });
        const finance = new ProjectFinanceModel({
            communityId: "507f191e810c19729de860ea",
            projectId: "507f1f77bcf86cd799439013",
            currency: "USD",
            budgetCents: 500000,
            billingModel: "hourly",
        });
        expect(entry.validateSync()).toBeUndefined();
        expect(finance.validateSync()).toBeUndefined();
        expect(entry.billingRateCents).toBe(12500);
    });

    it("supports versioned client deliverables and proofing assets", () => {
        const deliverable = new DeliverableModel({
            communityId: "507f191e810c19729de860ea",
            projectId: "507f1f77bcf86cd799439013",
            createdBy: "507f1f77bcf86cd799439011",
            title: "Homepage design",
            assets: [
                {
                    url: "https://example.com/design.pdf",
                    name: "design.pdf",
                    mimeType: "application/pdf",
                    revision: 1,
                },
            ],
        });
        expect(deliverable.validateSync()).toBeUndefined();
        expect(deliverable.status).toBe("draft");
        expect(deliverable.version).toBe(1);
    });
});
