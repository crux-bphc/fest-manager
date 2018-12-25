var fields = [];
fields.push({
    label: "Album Name",
    name:"album-name",
    placeholder: "E.g: FOB,SPONS",
    editable: true,
    type: "select",
    options: ["FOB", "SPONSORS"],
    value: "",
    typeahead: false,
    none: true,
});
fields.push({
    label: "Image",
    name:"image",
    editable: true,
    type: "image",
    required: true,
    value: "",
    typeahead: false,
    none: true,
    width: 800,
    height: 400,
    id: 1
});
fields.push({
    label: "Title",
    name:"title",
    editable: true,
    type: "textarea",
    required: false,
    value: "",
    typeahead: false,
    none: true
});
fields.push({
    label: "Sub-title",
    name:"subtitle",
    editable: true,
    type: "textarea",
    required: false,
    value: "",
    typeahead: false,
    none: true
});
module.exports = fields;