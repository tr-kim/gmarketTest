export function parseDateString(str) {
    if (!str) return "";
    str = String(str).trim();
  
    const len = str.length;
    const yyyy = str.slice(0, 4);
    const mm = str.slice(4, 6);
    const dd = str.slice(6, 8);
    const hh = str.slice(8, 10);

    switch (len) {
        case 4: 
            return yyyy;
        case 6: 
            return `${yyyy}-${mm}`;
        case 8: 
            return `${yyyy}-${mm}-${dd}`;
        case 10: 
            return `${yyyy}-${mm}-${dd} ${hh}:00`;
        default:
            return str; 
    }
}

	