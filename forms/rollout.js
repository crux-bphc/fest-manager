module.exports = function() {
    var fields = [];
    fields.push({
        name: "to",
        label: "To",
        editable: true,
        type: "text",
        required: false,
        placeholder: 'Event route | email id | empty to send to everyone',
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "title",
        label: "Title",
        editable: true,
        type: "text",
        required: true,
        placeholder: 'Give your notification a title text',
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "message",
        label: "Message",
        editable: true,
        type: "text",
        required: false,
        placeholder: 'A short message to convey',
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "type",
        label: "Type",
        editable: true,
        type: "select",
        required: false,
        options: ['Information', 'Success', 'Issue'],
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "route",
        label: "Route",
        editable: true,
        placeholder: "Where to redirect to",
        type: "text",
        required: false,
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "email",
        label: "Template",
        editable: true,
        value: "<!--Use $$<property-name>$$ to fill in user properties.\nList of available properties is \n- Name\n- Email\n- Phone\n- Institute-->",
        type: "textarea",
        required: false,
        none: true,
    });
    return fields;
};