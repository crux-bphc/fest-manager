module.exports = function() {
    var fields = [];
    fields.push({
        name: "name",
        label: "College Name",
        editable: true,
        type: "text",
        required: true,
        typeahead: 'institutes',
    });
    fields.push({
        name: "sport",
        label: "Sport",
        editable: true,
        type: "text",
        required: true,
        typeahead: 'sports',
        none: true,
    });
    fields.push({
        name: "rank",
        label: "Rank",
        editable: true,
        type: "number",
        value: 4,
        required: true,
        none: true,
    });
    fields.push({
        name: "help",
        label: "Rank Guide",
        editable: false,
        type: "text",
        value: "Gold - 1, Silver - 2, Bronze - 3.",
    })
    return fields;
}