module.exports = function() {
    var fields = [];
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
        name: "text",
        label: "Commentary",
        editable: true,
        type: "text",
        required: true,
    });
    fields.push({
        name: "team1",
        label: "Team 1",
        editable: true,
        type: "text",
        required: false,
        typeahead: 'institutes',
    });
    fields.push({
        name: "team2",
        label: "Team 2",
        editable: true,
        type: "text",
        required: false,
        typeahead: 'institutes',
    });
    fields.push({
        name: "help",
        label: "Team Guide",
        editable: false,
        type: "text",
        value: "You can leave teams empty.",
    })
    return fields;
}