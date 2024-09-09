export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Text, 'err' : IDL.Text });
  return IDL.Service({
    'createInvoice' : IDL.Func([IDL.Text], [Result], []),
    'getInvoice' : IDL.Func([IDL.Nat], [Result], ['query']),
    'getStripePublishableKey' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
