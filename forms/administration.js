module.exports = function() {
    var fields = [];
    fields.push({
        name: "name",
        label: "Name",
        editable: true,
        type: "text",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "institute",
        label: "Institute",
        editable: true,
        type: "text",
        required: true,
        typeahead: "institutes",
        none: true,
    });
    fields.push({
        name: "email",
        label: "Email",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    fields.push({
        name: "phone",
        label: "Phone",
        editable: true,
        type: "text",
        required: false,
        typeahead: false,
        none: true,
    });
    return fields;
}