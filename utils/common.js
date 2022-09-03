const stringGenerator = function (
    length = 5,
    loweralpha = 1,
    upperalpha = 1,
    digits = 0,
    special = 0,
) {
    var result = "";

    var characters = "";
    if (digits) characters += "0123456789";
    if (upperalpha) characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (loweralpha) characters += "abcdefghijklmnopqrstuvwxyz";
    if (special) characters += "!@#$%^&";

    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
};

module.exports = { stringGenerator };
