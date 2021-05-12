export const PARAMETER_ENTREPRISE_NAME = "Nom de l'entreprise";
export const PARAMETER_DEFAULT_TVA = 'Taux de TVA par défaut';
export const PARAMETER_DEFAULT_CASHING = "Mode d'encaissement par défaut";
export const PARAMETER_DEFAULT_DEBIT_ACCOUNT = 'Compte à débiter par défaut';
export const PARAMETER_DEFAULT_CREDIT_ACCOUNT = 'Compte à créditer par défaut';
export const UNIQUE_KEY_COL_ID = 'ref';

export const PARAMETER_KEYS = new Map();
PARAMETER_KEYS.set(PARAMETER_ENTREPRISE_NAME, null);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_TVA, [
  { key: '20', text: '20%', value: '20' },
  { key: '10', text: '10%', value: '10' },
  { key: '5.5', text: '5,5%', value: '5.5' },
  { key: '2.1', text: '2,1%', value: '2.1' },
  { key: '0', text: '0%', value: '0' },
]);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_CASHING, [
  { key: 'Virement', text: 'Virement', value: 'Virement' },
  { key: 'CB', text: 'CB', value: 'CB' },
  { key: 'Espèces', text: 'Espèces', value: 'Espèces' },
  { key: 'Chèque', text: 'Chèque', value: 'Chèque' },
  { key: 'Effets de commerce', text: 'Effets de commerce', value: 'Effets de commerce' },
  { key: 'Virement commercial (SIT)', text: 'Virement commercial (SIT)', value: 'Virement commercial (SIT)' },
]);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_DEBIT_ACCOUNT, [
  { key: '701', text: '701 - Ventes de produits finis', value: '701 - Ventes de produits finis' },
  { key: '706', text: '706 - Prestations de services', value: '706 - Prestations de services' },
  { key: '707', text: '707 - Ventes de marchandises', value: '707 - Ventes de marchandises' },
  { key: '708', text: '708 - Produits des activités annexes', value: '708 - Produits des activités annexes' },
  { key: '7085', text: '7085 - Ports et frais accessoires facturés', value: '7085 - Ports et frais accessoires facturés' },
]);
PARAMETER_KEYS.set(PARAMETER_DEFAULT_CREDIT_ACCOUNT, null);
