$(function() {   
	$("#account").couchLogin({
		loggedIn : function(r) {
		    $("#profile").couchProfile(r, {});
            wireUpTable();
        },
        loggedOut : function() {
                $("#profile").html('<p>Please log in to see your profile.</p>');
                $("#content").html("You must log in to view the registry.");
		}
    });
        
    // TODO:  Convert to common method for all term-based views....
	function wireUpTable() {
	    $("#content").jtable({
		    title: 'Terms Registry',
            paging: true,
            // By default jTable uses a POST for everything, which doesn't work when couchdb expects a GET (lists, views, shows)
            // TODO:  Figure out how to do this for just the listAction
            ajaxSettings: {
                type: 'GET'
            },
			actions: { 
                listAction: '/tr/_design/trapp/_list/jtable/temp-terms'
             },
			fields: {
                id:
                {
                    key: true,
                    list: false
				},
                recordType: {
                    title: 'Record Type',
                    list: false
                },
                uniqueId: {
                    title: 'Unique ID'
                },
                localUniqueId: {
                    title: 'Local Unique ID',
                    list: false
                },
                defaultValue: {
                    title: 'Default Value',
                },
                description: {
                    title: 'Description / Notes',
                    sorting: false,
                    edit: false,
                    create: false,
                    display: function(record) {
                        var rawHtml = '<!-- ' + JSON.stringify(record.record) + '-->\n';
                        if (record.record.description != null && record.record.description != undefined) {
                            rawHtml += '<p class="description">' + record.record.description + '</p>';
                        }
                        if (record.record.notes != null && record.record.notes != undefined) {
                            rawHtml += '<p class="notes">' + record.record.notes + '</p>';
                        }
                        return $(rawHtml);
                    }
                },
                action: {
                    title: 'Actions',
                    edit: false,
                    create: false,
                    display: function(record) {
                        var $link = $('<a href="/_utils/document.html?tr/' + record.record.id + '">View/Edit</a><br/> <a href="/tr/_design/trapp/_view/aliasesByParent?key=&quot;' + record.record.uniqueId + '&quot;">View Aliases</a>');
                        return $link;
                    }
                }
		    },
		});
        $("#content").jtable('load');
	}

	// TODO:  Wire up pagination

	// TODO:  Wire up the list of aliases

	// TODO:  Wire up the add button

	// TODO:  Wire the delete button

	// TODO:  Create a basic view for terms and aliases

	// TODO:  Wire up jTable with actual data
 });