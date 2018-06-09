function makeEventsDraggable() { 
        $( ".fc-draggable" ).draggable({
            zIndex: 999,
            revert: true,      // will cause the event to go back to its
            revertDuration: false  //  original position after the drag
        });
    }

    $(document).ready(function() {

        var dragged = null;

        /* initialize the external events
        -----------------------------------------------------------------*/

        $('#external-events .fc-event').each(function() {

            // store data so the calendar knows to render an event upon drop
            $(this).data('event', {
                title: $.trim($(this).text()), // use the element's text as the event title
                stick: true // maintain when user navigates (see docs on the renderEvent method)
            });

            // make the event draggable using jQuery UI
            $(this).draggable({
                zIndex: 999,
                revert: true,      // will cause the event to go back to its
                revertDuration: 0  //  original position after the drag
            });

        });


        /* initialize the calendar
        -----------------------------------------------------------------*/

        var calendar = $('#calendar').fullCalendar({
            header: {
                left: 'prev,next today',
                center: 'title',
                right: 'month,agendaWeek,agendaDay'
            },
            editable: true,
            droppable: true, // this allows things to be dropped onto the calendar
            dragRevertDuration: 0,
            drop: function() {
                makeEventsDraggable();
                // is the "remove after drop" checkbox checked?
                if ($('#drop-remove').is(':checked')) {
                    // if so, remove the element from the "Draggable Events" list
                    $(this).remove();
                }
            },
            eventDragStop: function( event, jsEvent, ui, view ) {
                makeEventsDraggable();
            },
            eventResize: function( event, delta, revertFunc, jsEvent, ui, view ) {
                makeEventsDraggable();
            },
            viewRender: function() {
                makeEventsDraggable();
            },
            eventDragStart:function( event, jsEvent, ui, view ) {
                dragged = [ calendar, event ];
            },
        });


        /* Make external-events droppable
        -----------------------------------------------------------------*/
        $('#external-events-listing').droppable({
            drop: function( event, ui ) { 
                if ( dragged ) {
                  var event = dragged[1];
                  dragged[0].fullCalendar('removeEvents',event._id);
                  var el = $( "<div class='fc-event'>" ).appendTo( this ).text( event.title );
                  el.draggable({
                      zIndex: 999,
                      revert: true, 
                      revertDuration: 0 
                  });
                  el.data('event', { title: event.title, id :event.id, stick: true });
                  dragged = null;
                  makeEventsDraggable();
                }
            }
        });


    });