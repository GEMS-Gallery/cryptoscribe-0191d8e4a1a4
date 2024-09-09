import Hash "mo:base/Hash";

import Debug "mo:base/Debug";
import Error "mo:base/Error";
import Text "mo:base/Text";
import HashMap "mo:base/HashMap";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

actor InvoiceGenerator {
    private let stripePublishableKey : Text = "YOUR_STRIPE_PUBLISHABLE_KEY";

    private var invoices = HashMap.HashMap<Nat, Text>(0, Nat.equal, Nat.hash);
    private var nextInvoiceId : Nat = 1;

    public func createInvoice(invoiceData : Text) : async Result.Result<Text, Text> {
        let invoiceId = nextInvoiceId;
        nextInvoiceId += 1;

        invoices.put(invoiceId, invoiceData);

        let mockCheckoutSessionId = "cs_test_" # Nat.toText(invoiceId);

        let response = "{\"invoiceId\":" # Nat.toText(invoiceId) # ",\"checkoutSessionId\":\"" # mockCheckoutSessionId # "\"}";

        #ok(response)
    };

    public query func getInvoice(id : Nat) : async Result.Result<Text, Text> {
        switch (invoices.get(id)) {
            case (null) { #err("Invoice not found") };
            case (?invoice) { #ok(invoice) };
        }
    };
}
