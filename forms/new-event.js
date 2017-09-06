module.exports = function(event) {
    var fields = [];
    fields.push({
        name: "description",
        placeholder: "Add a description",
        editable: true,
        type: "textarea",
        required: true,
        rows: 8,
        value: event ? event.description : "",
        typeahead: false,
        none: true,
    });
    fields.push({
        name: "hero",
        editable: true,
        type: "image",
        required: true,
        value: event ? event.hero : "",
        typeahead: false,
        none: true,
        width: 800,
        height: 400,
        id: 1
    });
    fields.push({
        name: "thumbnail",
        editable: true,
        type: "image",
        id: 0,
        required: true,
        value: event ? event.thumbnail : "",
        typeahead: false,
        none: true,
        width: 500,
        height: 500
    });
    fields.push({
        name: "type",
        placeholder: "Type",
        editable: true,
        value: event ? event.type : "",
        type: "select",
        options: ["Headliner", "Competition", "Workshop", "Proshow"],
        none: true,
        group: 0,
    });
    fields.push({
        name: "title",
        placeholder: "Title",
        editable: true,
        value: event ? event.title : "",
        type: "text",
        none: true,
        group: 1,
    });
    fields.push({
        name: "tagline",
        placeholder: "Tagline",
        editable: true,
        value: event ? event.tagline : "",
        type: "text",
        none: true,
        group: 1,
    });
    fields.push({
        name: "category",
        placeholder: "Category",
        editable: true,
        type: "text",
        value: event ? event.category : "",
        none: true,
        group: 1,
    });
    fields.push({
        name: "venue",
        placeholder: "Venue",
        editable: true,
        type: "text",
        value: event ? event.venue : "",
        none: true,
        group: 2,
    });
    fields.push({
        name: "prize",
        placeholder: "Prize Money",
        editable: true,
        type: "number",
        value: event ? event.prize : "",
        none: true,
        group: 2,
    });
    fields.push({
        name: "price",
        placeholder: "Entry Fee",
        editable: true,
        value: event ? event.price : "",
        type: "number",
        none: true,
        group: 2,
    });
    fields.push({
        name: "route",
        placeholder: "Route",
        editable: true,
        value: event ? event.route : "",
        type: "text",
        none: true,
        group: 2,
    });
    fields.push({
        name: "teamSize",
        placeholder: "Team Size",
        editable: true,
        value: event ? event.teamSize : "",
        type: "number",
        none: true,
        group: 2,
    });
    fields.push({
        name: "starttime",
        placeholder: "Start Time",
        editable: true,
        value: event ? event.startTime : "",
        type: "text",
        none: true,
        group: 2,
    });
    fields.push({
        name: "endtime",
        placeholder: "End Time",
        editable: true,
        type: "text",
        none: true,
        value: event ? event.endTime : "",
        group: 2,
    });
    return fields;
};