(function() {
    var width, height, base64;
    var support_language = ['zh', 'en'];

    if (support_language.indexOf($.i18n.getLocale()) !== -1) {
        $('#image-recogintion').show();

        $('.btn-upload').on('click', function() {
            $('#ipt-file').click();
        });

        $('#ipt-file').on('change', function() {
            const file = this.files[0];
            if (!file) return;
            preProcess(file);
        });

        // 剪切板检测
        $(document).on('paste', function (event) {
            event = event.originalEvent;
            var cbd = window.clipboardData || event.clipboardData; //兼容ie||chrome
            var ua = window.navigator.userAgent;
            if (!(event.clipboardData && event.clipboardData.items)) {
                return;
            }
            if (cbd.items &&
        cbd.items.length === 2 &&
        cbd.items[0].kind === 'string' &&
        cbd.items[1].kind === 'file' &&
        cbd.types &&
        cbd.types.length === 2 &&
        cbd.types[0] === 'text/plain' &&
        cbd.types[1] === 'Files' &&
        ua.match(/Macintosh/i) &&
        Number(ua.match(/Chrome\/(\d{2})/i)[1]) < 49) {
                return;
            }
            var itemLength = cbd.items.length;
            if (itemLength === 0) return;
            if (itemLength === 1 && cbd.items[0].kind === 'string') return;
            if ((itemLength === 1 && cbd.items[0].kind === 'file')) {
                var item = cbd.items[0];
                var blob = item.getAsFile();
                preProcess(blob);
            }
            console.log(event);
        });
    }

    // 图像预处理
    function preProcess(file) {
    // 获取图像宽高
        const img = new Image();
        img.onload = function () {
            height = this.height;
            width = this.width;
            if (height > 900 || width > 900) {
                alert($.i18n.prop('image_too_large'));
                return;
            }
            getBase64(file);
        };
        const _URL = window.URL || window.webkitURL;
        img.src = _URL.createObjectURL(file);
        $('#img-upload').attr('src', _URL.createObjectURL(file));
    }

    // 获取图像 base64 编码
    function getBase64(file) {
        const reader = new FileReader();
        reader.onload = e => {
            base64 = e.target.result.replace(/^data:image\/(png|jpe?g|gif);base64,/, '');
            upload();
        };
        reader.readAsDataURL(file);
    }

    // 上传图像
    function upload() {
        $('.progress-bar').addClass('animated flash infinite');
        $('#image-recogintion > p').addClass('text-muted');
        $('#before-upload').slideDown();
        $('#after-upload').slideUp();
        $.post('https://ocr.zsnmwy.net/upload', {image: base64}, function(res) {
            $('.progress-bar').removeClass('infinite');
            $('#image-recogintion > p').removeClass('text-muted');
            $('#before-upload').slideUp();
            $('#after-upload').slideDown();
            res.gayser_name = getGeyserName_type_temp(res.type, res.temp);
            if (Number(res.gayser_name.length) <= 1) {
                res.gayser_name = getGeyserName_name(res.type);
            }
            console.log(res);
            fillForm(res);
        });
    }

    function fillForm(fields) {
        $('#Geyser_type').val(fields.gayser_name);
        $('#input_RT_Eruption').val(fields.output);
        $('#input_Eruption_Period_Max').val(fields.ep[0]);
        $('#input_Eruption_Period_Min').val(fields.ep[1]);
        $('#input_Acitve_Period_Max').val(fields.ap[0]);
        $('#input_Acitve_Period_Min').val(fields.ap[1]);
    }

    var geyser_name_list_type_temp = {
        'Cool_Steam_Vent':                { temp: 383.15, name: ['steam', '水蒸气', '蒸汽']},
        'Steam_Vent':                     { temp: 773.15, name: ['steam', '水蒸气', '蒸汽'] },
        'Cool_Slush_Geyser':              { temp: 263.15, name: ['polluted water', '污染水'] },
        'Polluted_Water_Vent':            { temp: 303.15, name: ['polluted water', '污染水'] },
        'Volcano':                        { temp: 2000,   name: ['magma', '岩浆'] },
        'Minor_Volcano':                  { temp: 2000,   name: ['magma', '岩浆'] },
        'Carbon_Dioxide_Geyser':          { temp: 218,    name: ['liquid carbon dioxide', '二氧化碳'] },
        'Carbon_Dioxide_Vent':            { temp: 773.15, name: ['carbon dioxide', '二氧化碳'] },
        'Polluted_Oxygen_Vent':           { temp: 773.15, name: ['polluted oxygen', '污染氧'] },
        'Infectious_Polluted_Oxygen_Vent':{ temp: 333.15, name: ['polluted oxygen', '污染氧'] },
    };

    var geyser_name_list_name = {
        'Chlorine_Gas_Vent':              { temp: 333.15, name: ['chlorine', '氯'] },
        'Natural_Gas_Geyser':             { temp: 423.15, name: ['natural gas', '天然气'] },
        'Copper_Volcano':                 { temp: 2500,   name: ['molten copper', '铜','熔融铜'] },
        'Iron_Volcano':                   { temp: 2800,   name: ['molten iron', '铁'] },
        'Gold_Volcano':                   { temp: 2900,   name: ['molten gold', '金'] },
        'Leaky_Oil_Fissure':              { temp: 600,    name: ['crude oil', '原油'] },
        'Hydrogen_Vent':                  { temp: 773.15, name: ['hydrogen', '氢'] },
        'Water_Geyser':                   { temp: 368.15, name: ['water', '水'] },
    }

    function getGeyserName_type_temp (type, temp) {
        for (let name in geyser_name_list_type_temp) {
            let item = geyser_name_list_type_temp[name];
            if (item.temp !== temp) continue;
            if (item.name.indexOf(type.toLowerCase()) !== -1) return name;
        }
        return '';
    }

    function getGeyserName_name (type) {
        for (let name in geyser_name_list_name) {
            let item = geyser_name_list_name[name];
            if (item.name.indexOf(type.toLowerCase()) !== -1) return name;
        }
    }

})();
