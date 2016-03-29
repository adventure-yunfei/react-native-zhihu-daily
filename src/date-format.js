/*
 * ----------------------------------------------------------------------------
 * Package:     JS Date Format Patch
 * Version:     0.9.12
 * Date:        2012-07-06
 * Description: In lack of decent formatting ability of Javascript Date object,
 *              I have created this "patch" for the Date object which will add
 *              "Date.format(dateObject, format)" static function, and the
 *              "dateObject.toFormattedString(format)" member function.
 *              Along with the formatting abilities, I have also added the
 *              following functions for parsing dates:
 *              "Date.parseFormatted(value, format)" - static function
 *              "dateObject.fromFormattedString(value, format)" - member
 *              function
 * Author:      Miljenko Barbir
 * Author URL:  http://miljenkobarbir.com/
 * Repository:  http://github.com/barbir/js-date-format
 * ----------------------------------------------------------------------------
 * Copyright (c) 2010 Miljenko Barbir
 * Dual licensed under the MIT and GPL licenses.
 * ----------------------------------------------------------------------------
 *
 * Modified by yunfei to fit for ES6 module and clear ESLint warning
 * Prevent to add to global Date object and instead export {formatDate: <Date.format>, parseDate: <Date.parseFormatted>}
 * Date format is the same with java SimpleDateFormat. (Sample: 'yyyy-MM-dd HH:mm:ss')
 */

// this is the parse logic helper object that contains the helper functions
const parseLogic = {
    unpad: function (value) {
        var output = value;

        while (output.length > 1) {
            if (output[0] === '0') {
                output = output.substring(1, output.length);
            } else {
                break;
            }
        }

        return output;
    },
    parseInt: function (value) {
        return parseInt(this.unpad(value), 10);
    }
};

// this is the format logic helper object that contains the helper functions
// and the internationalization settings that can be overridden
const formatLogic = {
    // left-pad the provided number with zeros
    pad: function (value, digits) {
        var max = 1;
        var zeros = '';

        if (digits < 1) {
            return '';
        }

        for (var i = 0; i < digits; i++) {
            max *= 10;
            zeros += '0';
        }

        var output = value;

        output = zeros + value;
        output = output.substring(output.length - digits);

        return output;
    },

    // convert the 24 hour style value to a 12 hour style value
    convertTo12Hour: function (value) {
        return value % 12 === 0 ? 12 : value % 12;
    },

    // internationalization settings
    i18n: {
        dayNames:			['星期天', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'],
        shortDayNames:		['日', '一', '二', '三', '四', '五', '六'],
        monthNames:			['一月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月', '十一月', '十二月'],
        shortMonthNames:	['一', '二', '三', '四', '五', '六', '七', '八', '九', '十', '十一', '十二']
    }
};


// extend the Javascript Date class with the "format" static function which will format
// the provided date object using the provided format string
const format = function (date, format) {
    // get the helper functions object
    var _formatLogic = formatLogic;

    // check if the AM/PM option is used
    var isAmPm		= (format.indexOf('a') !== -1) || (format.indexOf('A') !== -1);

    // prepare all the parts of the date that can be used in the format
    var parts		= [];
    parts['d']		= date.getDate();
    parts['dd']		= _formatLogic.pad(parts['d'], 2);
    parts['ddd']	= _formatLogic.i18n.shortDayNames[date.getDay()];
    parts['dddd']	= _formatLogic.i18n.dayNames[date.getDay()];
    parts['M']		= date.getMonth() + 1;
    parts['MM']		= _formatLogic.pad(parts['M'], 2);
    parts['MMM']	= _formatLogic.i18n.shortMonthNames[parts['M'] - 1];
    parts['MMMM']	= _formatLogic.i18n.monthNames[parts['M'] - 1];
    parts['yyyy']	= date.getFullYear();
    parts['yyy']	= _formatLogic.pad(parts['yyyy'], 2) + 'y';
    parts['yy']		= _formatLogic.pad(parts['yyyy'], 2);
    parts['y']		= 'y';
    parts['H']		= date.getHours();
    parts['hh']		= _formatLogic.pad(isAmPm ? _formatLogic.convertTo12Hour(parts['H']) : parts['H'], 2);
    parts['h']		= isAmPm ? _formatLogic.convertTo12Hour(parts['H']) : parts['H'];
    parts['HH']		= _formatLogic.pad(parts['H'], 2);
    parts['m']		= date.getMinutes();
    parts['mm']		= _formatLogic.pad(parts['m'], 2);
    parts['s']		= date.getSeconds();
    parts['ss']		= _formatLogic.pad(parts['s'], 2);
    parts['z']		= date.getMilliseconds();
    parts['zz']		= parts['z'] + 'z';
    parts['zzz']	= _formatLogic.pad(parts['z'], 3);
    parts['ap']		= parts['H'] < 12 ? 'am' : 'pm';
    parts['a']		= parts['H'] < 12 ? 'am' : 'pm';
    parts['AP']		= parts['H'] < 12 ? 'AM' : 'PM';
    parts['A']		= parts['H'] < 12 ? 'AM' : 'PM';

    // parse the input format, char by char
    var i = 0;
    var output = '';
    var token = '';
    while (i < format.length) {
        token = format.charAt(i);

        while ((i + 1 < format.length) && parts[token + format.charAt(i + 1)] !== undefined) {
            token += format.charAt(++i);
        }

        if (parts[token] !== undefined) {
            output += parts[token];
        } else {
            output += token;
        }

        i++;
    }

    // return the parsed result
    return output;
};

// extend the Javascript Date class with the "parseDate" static function which
// will parse the provided string, using the provided format into a valid date object
const parseFormatted = function (value, format) {
    var output		= new Date(2000, 0, 1);
    var parts		= [];
    parts['d']		= '([0-9][0-9]?)';
    parts['dd']		= '([0-9][0-9])';
//	parts['ddd']	= NOT SUPPORTED;
//	parts['dddd']	= NOT SUPPORTED;
    parts['M']		= '([0-9][0-9]?)';
    parts['MM']		= '([0-9][0-9])';
//	parts['MMM']	= NOT SUPPORTED;
//	parts['MMMM']	= NOT SUPPORTED;
    parts['yyyy']	= '([0-9][0-9][0-9][0-9])';
    parts['yyy']	= '([0-9][0-9])[y]';
    parts['yy']		= '([0-9][0-9])';
    parts['H']		= '([0-9][0-9]?)';
    parts['hh']		= '([0-9][0-9])';
    parts['h']		= '([0-9][0-9]?)';
    parts['HH']		= '([0-9][0-9])';
    parts['m']		= '([0-9][0-9]?)';
    parts['mm']		= '([0-9][0-9])';
    parts['s']		= '([0-9][0-9]?)';
    parts['ss']		= '([0-9][0-9])';
    parts['z']		= '([0-9][0-9]?[0-9]?)';
    parts['zz']		= '([0-9][0-9]?[0-9]?)[z]';
    parts['zzz']	= '([0-9][0-9][0-9])';
    parts['ap']		= '([ap][m])';
    parts['a']		= '([ap][m])';
    parts['AP']		= '([AP][M])';
    parts['A']		= '([AP][M])';

    var _ = parseLogic;

    // parse the input format, char by char
    var i = 0;
    var regex = '';
    var outputs = new Array('');
    var token = '';

    // parse the format to get the extraction regex
    while (i < format.length) {
        token = format.charAt(i);
        while ((i + 1 < format.length) && parts[token + format.charAt(i + 1)] !== undefined) {
            token += format.charAt(++i);
        }

        if (parts[token] !== undefined) {
            regex += parts[token];
            outputs[outputs.length] = token;
        } else {
            regex += token;
        }

        i++;
    }

    // extract matches
    var r = new RegExp(regex);
    var matches = value.match(r);

    if (matches === undefined || matches.length !== outputs.length) {
        return undefined;
    }

    // parse each match and update the output date object
    for (i = 0; i < outputs.length; i++) {
        if (outputs[i] !== '') {
            switch (outputs[i]) {
                case 'yyyy':
                case 'yyy':
                    output.setYear(_.parseInt(matches[i]));
                    break;

                case 'yy':
                    output.setYear(2000 + _.parseInt(matches[i]));
                    break;

                case 'MM':
                case 'M':
                    output.setMonth(_.parseInt(matches[i]) - 1);
                    break;

                case 'dd':
                case 'd':
                    output.setDate(_.parseInt(matches[i]));
                    break;

                case 'hh':
                case 'h':
                case 'HH':
                case 'H':
                    output.setHours(_.parseInt(matches[i]));
                    break;

                case 'mm':
                case 'm':
                    output.setMinutes(_.parseInt(matches[i]));
                    break;

                case 'ss':
                case 's':
                    output.setSeconds(_.parseInt(matches[i]));
                    break;

                case 'zzz':
                case 'zz':
                case 'z':
                    output.setMilliseconds(_.parseInt(matches[i]));
                    break;

                case 'AP':
                case 'A':
                case 'ap':
                case 'a':
                    if ((matches[i] === 'PM' || matches[i] === 'pm') && (output.getHours() < 12)) {
                        output.setHours(output.getHours() + 12);
                    }

                    if ((matches[i] === 'AM' || matches[i] === 'am') && (output.getHours() === 12)) {
                        output.setHours(0);
                    }
                    break;
            }
        }
    }

    return output;
};

export const formatDate = format;
export const parseDate = parseFormatted;
