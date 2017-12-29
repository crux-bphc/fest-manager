module.exports = function() {
    var fields = [];
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
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "phone1",
        label: "Contact 1",
        editable: true,
        type: "text",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "phone2",
        label: "Contact 2",
        editable: true,
        type: "text",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "link",
        label: "Entry Link",
        editable: true,
        type: "text",
        required: true,
        placeholder: "Enter a video link",
        none: true,
    });
    return fields;
}