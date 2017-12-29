module.exports = function() {
    var fields = [];
    fields.push({
        name: "name",
        label: "Name",
        editable: true,
        type: "text",
        placeholder: "Enter name of band",
        required: true,
        typeahead: false,
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
        name: "phone",
        label: "Phone",
        editable: true,
        type: "text",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "genre",
        label: "Genre",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    fields.push({
        name: "language",
        label: "Language",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    fields.push({
        name: "location",
        label: "Location",
        editable: true,
        type: "text",
        required: false,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "link1",
        label: "Entry 1",
        editable: true,
        type: "text",
        required: true,
        placeholder: "Enter a video link",
        none: true,
    });
    fields.push({
        name: "link2",
        label: "Entry 2",
        editable: true,
        type: "text",
        placeholder: "Enter a video link",
        required: true,
        none: true,
    });
    return fields;
}