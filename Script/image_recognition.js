(function() {
  var width, height, base64

  if ($.i18n.getLocale() == 'zh') {
    $('#image-recogintion').show()

    $('.btn-upload').on('click', function() {
      $('#ipt-file').click()
    })

    $('#ipt-file').on('change', function() {
      const file = this.files[0]
      if (!file) return
      preProcess(file)
    })
  }

  // 图像预处理
  function preProcess(file) {
    // 获取图像宽高
    const img = new Image()
    img.onload = function () {
      height = this.height
      width = this.width
      if (height > 900 || width > 900) {
        alert('图片尺寸太大，请只截取喷泉相关部分，避免无用信息参与分析')
        return
      }
      getBase64(file)
    }
    const _URL = window.URL || window.webkitURL
    img.src = _URL.createObjectURL(file)
    $('#img-upload').attr('src', _URL.createObjectURL(file))
  }

  // 获取图像 base64 编码
  function getBase64(file) {
    const reader = new FileReader()
    reader.onload = e => {
      base64 = e.target.result.replace(/^data:image\/(png|jpe?g|gif);base64,/, '')
      upload()
    }
    reader.readAsDataURL(file)
  }

  // 上传图像
  function upload() {
    $('.progress-bar').addClass('animated flash infinite')
    $('#image-recogintion > p').addClass('text-muted')
    $('#before-upload').slideDown()
    $('#after-upload').slideUp()
    $.post('https://game.mutoe.com/oni/upload', {image: base64}, function(res) {
      $('.progress-bar').removeClass('infinite')
      $('#image-recogintion > p').removeClass('text-muted')
      $('#before-upload').slideUp()
      $('#after-upload').slideDown()
      res.gayser_name = getGeyserName(res.type, res.temp)
      console.log(res)
      fillForm(res)
    })
  }

  function fillForm(fields) {
    $('#Geyser_type').val(fields.gayser_name)
    $('#input_RT_Eruption').val(fields.output)
    $('#input_Eruption_Period_Max').val(fields.ep[0])
    $('#input_Eruption_Period_Min').val(fields.ep[1])
    $('#input_Acitve_Period_Max').val(fields.ap[0])
    $('#input_Acitve_Period_Min').val(fields.ap[1])
  }

  var gayser_name_list = {
    'Cool_Steam_Vent':                { temp: 383.15, name: ['steam', '水蒸气'] },
    'Steam_Vent':                     { temp: 773.15, name: ['steam', '水蒸气'] },
    'Water_Geyser':                   { temp: 368.15, name: ['water', '水'] },
    'Cool_Slush_Geyser':              { temp: 263.15, name: ['polluted water', '污染水'] },
    'Polluted_Water_Vent':            { temp: 303.15, name: ['polluted water', '污染水'] },
    'Volcano':                        { temp: 2000,   name: ['magma', '岩浆'] },
    'Minor_Volcano':                  { temp: 2000,   name: ['magma', '岩浆'] },
    'Carbon_Dioxide_Geyser':          { temp: 218,    name: ['liquid carbon dioxide'] },
    'Carbon_Dioxide_Vent':            { temp: 773.15, name: ['carbon dioxide', '二氧化碳'] },
    'Hydrogen_Vent':                  { temp: 773.15, name: ['hydrogen', '氢'] },
    'Polluted_Oxygen_Vent':           { temp: 773.15, name: ['polluted oxygen'] },
    'Infectious_Polluted_Oxygen_Vent':{ temp: 333.15, name: ['polluted oxygen'] },
    'Chlorine_Gas_Vent':              { temp: 333.15, name: ['chlorine', '氯'] },
    'Natural_Gas_Geyser':             { temp: 423.15, name: ['natural gas', '天然气'] },
    'Copper_Volcano':                 { temp: 2500,   name: ['molten copper'] },
    'Iron_Volcano':                   { temp: 2800,   name: ['molten iron'] },
    'Gold_Volcano':                   { temp: 2900,   name: ['molten gold', '金'] },
    'Leaky_Oil_Fissure':              { temp: 600,    name: ['crude oil'] },
  }

  function getGeyserName (type, temp) {
    for (let name in gayser_name_list) {
      let item = gayser_name_list[name]
      if (item.temp !== temp) continue
      if (item.name.indexOf(type) !== -1) return name
    }
    return ''
  }


})()