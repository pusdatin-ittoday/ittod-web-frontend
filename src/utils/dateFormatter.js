export const parseWIB = (dateString) => {
    if (!dateString) return new Date();
    let s = dateString.toString().replace(' ', 'T').replace('Z', '');
    return new Date(s + '+07:00');
};
