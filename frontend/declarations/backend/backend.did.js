export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({
    'ok' : IDL.Tuple(IDL.Nat, IDL.Text),
    'err' : IDL.Text,
  });
  return IDL.Service({
    'createInvoice' : IDL.Func([IDL.Text], [Result], []),
    'getInvoice' : IDL.Func([IDL.Nat], [IDL.Opt(IDL.Text)], ['query']),
    'getStripePublishableKey' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
