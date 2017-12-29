module.exports = function() {
    var fields = [];
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
        name: "name",
        label: "Title",
        editable: true,
        type: "text",
        placeholder: "Enter name of film",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "director",
        label: "Director",
        editable: true,
        type: "text",
        required: true,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "cast",
        label: "Cast",
        editable: true,
        type: "text",
        required: true,
        placeholder: 'Enter a comma seperated list of cast members',
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "link",
        label: "Entry",
        editable: true,
        type: "text",
        required: true,
        placeholder: "Enter a Youtube/Vimeo/Drive link",
        none: true,
    });
    fields.push({
        name: "phone1",
        label: "Contact 1",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    fields.push({
        name: "phone2",
        label: "Contact 2",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    fields.push({
        name: "phone3",
        label: "Contact 3",
        editable: true,
        type: "text",
        required: true,
        none: true,
    });
    return fields;
}