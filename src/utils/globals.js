export const PARAMETER_ENTREPRISE_NAME = "Nom de l'entreprise";
export const PARAMETER_DEFAULT_TVA = 'Taux de TVA par défaut';
export const PARAMETER_DEFAULT_CASHING = "Mode d'encaissement par défaut";
export const PARAMETER_DEFAULT_DEBIT_ACCOUNT = 'Compte à débiter par défaut';
export const PARAMETER_DEFAULT_CREDIT_ACCOUNT = 'Compte à créditer par défaut';
export const PARAMETER_DEFAULT_CREDIT_TYPE = 'Type de recette pour la TVA par défaut';
export const UNIQUE_KEY_COL_ID = 'ref';

// Liste extraite de la déclaration TVA 3310
export const CREDIT_TYPES = [
  {
    key: '01',
    value: '01 - Ventes, prestations de services',
    text: '01 - Ventes, prestations de services',
    isTaxable: true,
  },
  {
    key: '7A',
    value: '7A - Ventes de biens ou prestations de services réalisées par un assujetti non établi en France (art 283-1 du CGI)',
    text: '7A - Ventes de biens ou prestations de services réalisées par un assujetti non établi en France (art 283-1 du CGI)',
    isTaxable: false,
  },
  {
    key: '5A',
    value: '5A - Ventes à distance au profit de particuliers (consommateurs finaux) - ventes B to C',
    text: '5A - Ventes à distance au profit de particuliers (consommateurs finaux) - ventes B to C',
    isTaxable: false,
  },
  {
    key: '06',
    value: '06 - Livraisons intracommunautaires - ventes B to B',
    text: '06 - Livraisons intracommunautaires - ventes B to B',
    isTaxable: false,
  },
  {
    key: '04',
    value: '04 - Exportations hors UE',
    text: '04 - Exportations hors UE',
    isTaxable: false,
  },
  {
    key: '02',
    value: '02 - Autres opérations imposables',
    text: '02 - Autres opérations imposables',
    isTaxable: true,
  },
  {
    key: '05',
    value: '05 - Autres opérations non imposables',
    text: '05 - Autres opérations non imposables',
    isTaxable: false,
  },
];

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
PARAMETER_KEYS.set(PARAMETER_DEFAULT_CREDIT_TYPE, CREDIT_TYPES.map(({ key, text, value }) => ({ key, text, value })));
