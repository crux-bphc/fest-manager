(function () {
	var portal = $("#_portal");
    portal.state = {
        events: {
            displayTemplate: `
                <div class="event display">
                    <div class="left">
                        <div class="thumbnail"><img src="%_event.thumb_%"/></div>
                        <div class="type">%_event.type%</div>
                    </div>
                    <div class="right">
                        <div class="title">%_event.title_%</div>
                        <div class="tagline">%_event.tagline_%</div>
                        <div class="category">%_event.category_%</div>
                    </div>
                    <div class="actions">
                        <div onclick="showSubscribers(%_event.id_%)">See Subscribers</div>
                        <div class="problemstatementToggle">See Problem Statement</div>
                    </div>
                    <div class="footer">
                        <div class="time">%_event.datetime_%</div>
                        <div class="venue">%_event.venue_%</div>
                        <div class="contact">%_event.contact_%</div>
                    </div>
                    <div class="problem_statement">
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                    </div>
                </div>
            `,
            editTemplate: `
                <div class="event edit_item">
                    <div class="left">
                        <div class="thumbnail">
                            <input type="text" value="%_event.thumb_%" name="thumbnail"/>
                        </div>
                        <div class="type">
                            <input type="text" value="%_event.type_%" name="type"/>
                        </div>
                    </div>
                    <div class="right">
                        <div class="title">
                            <input type="text" value="%_event.title_%" name="title"/>
                        </div>
                        <div class="tagline">
                            <input type="text" %_event.tagline_% name="tagline"/>
                        </div>
                        <div class="category">
                            <input type="text" %_event.category_% name="category"/>
                        </div>
                    </div>
                    <div class="footer">
                        <div class="time">
                            <input type="text" %_event.time_% name="category"/>
                        </div>
                        <div class="venue">
                            <input type="text" %_event.venue_% name="category"/>
                        </div>
                        <div class="contact">
                            <input type="text" %_event.contact_% name="category"/>
                        </div>
                    </div>
                    <div class="problem_statement">
                        <span>Edit Problem Statement</span>
                    </div>
                </div>
            `,
            list: [],
            stageEventListeners: function() {
                $('.controls .icon-close').click(function() {
                    $('.controls .latent').removeClass('active');
                });
                $('.controls .icon-check').click(function(){console.log(this)});
            },
            submit: function() {
                let newEvent = this.find(':input').serializeArray();
                console.log(newEvent);
            },
            edit: function(id) {
                if(!id) {
                    $('.new_item').addClass('.edit_item');
                }
                $('.controls .latent').addClass('active');
            }
        }
    };
    var md_config = {
        element: $('.simplemde')[0],
        toolbar:false,
        status:false,
        tabsize: 4,
    };

    portal.form = function () {
		portal.state.events.edit();
	}
	portal.find('.controls .icon-add').click(portal.form);
    // var simplemde = new SimpleMDE(md_config);
})();
