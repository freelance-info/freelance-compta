export const PARAMETER_ENTREPRISE_NAME = "Nom de l'entreprise";
export const PARAMETER_DEFAULT_TVA = 'Taux de TVA par défaut';
export const PARAMETER_DEFAULT_CASHING = "Mode d'encaissement par défaut";
export const PARAMETER_KEYS = [PARAMETER_ENTREPRISE_NAME, PARAMETER_DEFAULT_TVA, PARAMETER_DEFAULT_CASHING];
export const OPTIONS_TVA = [
    { key: '20', text: '20%', value: '20' },
    { key: '10', text: '10%', value: '10' },
    { key: '5.5', text: '5,5%', value: '5.5' },
    { key: '2.1', text: '2,1%', value: '2.1' },
];
export const OPTIONS_CASHING = [
    { key: 'Virement', text: 'Virement', value: 'Virement' },
    { key: 'CB', text: 'CB', value: 'CB' },
    { key: 'Espèces', text: 'Espèces', value: 'Espèces' },
    { key: 'Chèque', text: 'Chèque', value: 'Chèque' },
    { key: 'Effets de commerce', text: 'Effets de commerce', value: 'Effets de commerce' },
    { key: 'Virement commercial (SIT)', text: 'Virement commercial (SIT)', value: 'Virement commercial (SIT)' },
];

