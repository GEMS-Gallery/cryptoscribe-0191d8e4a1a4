import Bool "mo:base/Bool";
import Float "mo:base/Float";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  type InvoiceItem = {
    description: Text;
    quantity: Float;
    price: Float;
  };

  type Invoice = {
    id: Nat;
    companyName: Text;
    companyAddress: Text;
    companyEmail: Text;
    clientName: Text;
    clientAddress: Text;
    clientEmail: Text;
    items: [InvoiceItem];
    colorTheme: Text;
    timestamp: Time.Time;
  };

  stable var invoices : [Invoice] = [];
  stable var nextId : Nat = 0;

  public func createInvoice(companyName: Text, companyAddress: Text, companyEmail: Text,
                            clientName: Text, clientAddress: Text, clientEmail: Text,
                            items: [InvoiceItem], colorTheme: Text) : async Result.Result<Invoice, Text> {
    let invoice : Invoice = {
      id = nextId;
      companyName = companyName;
      companyAddress = companyAddress;
      companyEmail = companyEmail;
      clientName = clientName;
      clientAddress = clientAddress;
      clientEmail = clientEmail;
      items = items;
      colorTheme = colorTheme;
      timestamp = Time.now();
    };
    invoices := Array.append(invoices, [invoice]);
    nextId += 1;
    #ok(invoice)
  };

  public query func getInvoices() : async [Invoice] {
    Array.sort(invoices, func(a: Invoice, b: Invoice) : { #less; #equal; #greater } {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };

  public query func getInvoice(id: Nat) : async ?Invoice {
    Array.find(invoices, func(invoice: Invoice) : Bool { invoice.id == id })
  };
}
