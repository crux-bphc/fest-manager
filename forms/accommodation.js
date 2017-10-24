module.exports = function() {
    var addition = [];
    addition.push({
        name: "label",
        label: "Label",
        editable: true,
        type: "text",
        required: false,
        placeholder: '',
        typeahead: false,
        none: true,
    });
    addition.push({
        name: "vacancy",
        label: "Vacancy",
        editable: true,
        type: "text",
        required: false,
        placeholder: '',
        typeahead: false,
        none: true,
    });

    var allotment = [];
    allotment.push({
        name: 'name',
        label: 'Name',
        editable: false,
        type: "text",
        required: false,
        none: true,
    });
    allotment.push({
        name: 'festID',
        label: 'Fest ID',
        editable: false,
        type: "text",
        required: false,
        none: true,
    });
    allotment.push({
        name: 'starttime',
        label: 'Check in',
        editable: false,
        type: "text",
        value: require('moment')().format('DD/MM hh:mmA'),
        required: true,
        placeholder: 'Enter check in time',
        none: true,
    });
    allotment.push({
        name: 'duration',
        label: 'Duration',
        editable: true,
        type: "Number",
        required: true,
        value: 1,
        placeholder: 'Number of days',
        none: true,
    });
    return {
        addition: addition,
        allotment: allotment,
    };
};