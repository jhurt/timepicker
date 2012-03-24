var Template = {
    renderTemplate: function(selector, data, callback) {
        if (callback != null) {
            callback(Mustache.render($(selector).html(), data));
        }
    }
};

function Timepicker(input) {
    this.input = input;
    this.hours = null;
    this.minute = null;
    this.amPm = null;
    this.timepickerSelector = null;
    this.init();
}

Timepicker.prototype.display = function() {
    if (this.hours != null && this.minutes != null && this.amPm != null) {
        this.input.val(this.hours + ':' + this.minutes + ' ' + this.amPm);
    }
};

Timepicker.prototype.hide = function() {
    if (this.hours != null && this.minutes != null && this.amPm != null) {
        $(this.timepickerSelector).hide();
    }
};

Timepicker.prototype.wireRowHover = function(selector, property, lowerRows) {
    var self = this;
    $(selector).hover(
        function () {
            //hover on
            $(selector).each(function(i, li) {
                $(li).find('span').removeClass('ui-state-hover');
            });
            var span = $(this).find('span');
            span.addClass("ui-state-hover");
            self[property] = span.text();
            self.display();
            for (var i = 0; i < lowerRows.length; i++) {
                var row = lowerRows[i];
                var left = $(this).position().left + $(this).parent().position().left;
                $(row).css('left', left + 'px');
                if (i == 0) {
                    $(row).show();
                }
            }
        },
        function () {
            //hover off, no op
        }
    );
};

Timepicker.prototype.setValue = function (selector, value) {
    if (value == '0') {
        value = '00';
    }
    $(selector).each(function(i, li) {
        var span = $(li).find('span');
        if (value == span.text()) {
            span.addClass('ui-state-hover');
            $(li).parent().show();
        }
    });
};

//reset to the value in the input
Timepicker.prototype.reset = function() {
    var self = this;
    var value = self.input.val();
    var tmp = value.split(' ');
    var hoursMinutes = tmp[0].split(':');
    this.hours = hoursMinutes[0];
    this.minutes = hoursMinutes[1];
    this.amPm = tmp[1];
    this.setValue(self.timepickerSelector + ' .hours li', this.hours);
    this.setValue(self.timepickerSelector + ' .minutes li', this.minutes);
    this.setValue(self.timepickerSelector + ' .ampm li', this.amPm);
};

Timepicker.prototype.init = function() {
    var self = this;
    var timepickerName = this.input.attr('name') + 'Timepicker';
    self.timepickerSelector = '#' + timepickerName;
    Template.renderTemplate('#timepicker_template', {name:timepickerName}, function(template) {
        //add the timepicker div to the dom
        self.input.after(template);

        //wire up the input click event
        self.input.click(function(e) {
            $(self.timepickerSelector).show();
        });

        $('body').click(function(e) {
            if (!($(e.target).hasClass('timepicker')) && !($(e.target).hasClass('timeBox'))) {
                $('.ui-timepickr').hide();
            }
        });

        //hover events for hours,minutes,ampm
        self.wireRowHover(self.timepickerSelector + ' .hours li', 'hours', [self.timepickerSelector + ' .minutes', self.timepickerSelector + ' .ampm']);
        self.wireRowHover(self.timepickerSelector + ' .minutes li', 'minutes', [self.timepickerSelector + ' .ampm']);
        self.wireRowHover(self.timepickerSelector + ' .ampm li', 'amPm', []);

        //click events for each hours,minutes,ampm
        var liClick = function (e) {
            self.hide();
        };
        $(self.timepickerSelector + ' .hours li').click(liClick);
        $(self.timepickerSelector + ' .minutes li').click(liClick);
        $(self.timepickerSelector + ' .ampm li').click(liClick);

        var value = self.input.val();
        if (value != null && value != '') {
            self.reset();
        }
    });
};
