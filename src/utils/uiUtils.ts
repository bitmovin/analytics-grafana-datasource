export const getAsOptionsList = (list: unknown[]): {value: unknown, text: unknown}[] => {
    return list.map((e) => ({value: e, text: e}));
}
