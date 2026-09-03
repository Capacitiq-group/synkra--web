// Version identifiers recorded against each checkout's consent_records
// rows (see synkra-client-hub's createCheckout), not shown to the user.
// Bump whichever one changes whenever the corresponding page's actual
// legal text is materially edited - these are what makes "the customer
// agreed to Terms v2026-09-02, not whatever the page happens to say
// today" answerable later, which a page's own "last updated" line alone
// doesn't give you once the page has since been edited again.
export const TERMS_VERSION = "2026-09-02";
export const PRIVACY_VERSION = "2026-09-02";
