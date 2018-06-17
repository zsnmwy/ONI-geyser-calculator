/* eslint-disable no-undef */
function get_input () {
  RT_Eruption = $('#input_RT_Eruption').val().trim()
  Eruption_Period_Min_Num = Number($('#input_Eruption_Period_Min').val().trim())
  Eruption_Period_Max_Num = Number($('#input_Eruption_Period_Max').val().trim())
  Acitve_Period_Min_Num = Number($('#input_Acitve_Period_Min').val().trim())
  Acitve_Period_Max_Num = Number($('#input_Acitve_Period_Max').val().trim())

  // 最小值大于最大值时交换

  if (Eruption_Period_Min_Num > Eruption_Period_Max_Num) {
    [Eruption_Period_Min_Num, Eruption_Period_Max_Num] = [Eruption_Period_Max_Num, Eruption_Period_Min_Num]
  }

  if (Acitve_Period_Min_Num > Acitve_Period_Max_Num) {
    [Acitve_Period_Min_Num, Acitve_Period_Max_Num] = [Acitve_Period_Max_Num, Acitve_Period_Min_Num]
  }

  console.log('RT Eruption', RT_Eruption)
  console.log('Eruption_Period_Min_Num', Eruption_Period_Min_Num)
  console.log('Eruption_Period_Max_Num', Eruption_Period_Max_Num)
  console.log('Acitve_Period_Min_Num', Acitve_Period_Min_Num)
  console.log('Acitve_Period_Max_Num', Acitve_Period_Max_Num)
}

function numfix (x, min, max) {
  var e = 2.72
  temp1 = x - min / (max - min)
  temp2 = temp1 * 12 - 6
  temp3 = 1 / (1 - Math.pow(e, temp2))
  temp4 = (temp3 - 0.002472623) / 0.995054754
  console.log('temp4',temp4)
  return temp4 * (max - min) + min
}

function cal_x_k () {
  get_input()
  n = (Eruption_Period_Min_Num * RT_Eruption * Acitve_Period_Min_Num) / Acitve_Period_Max_Num / Eruption_Period_Max_Num / 1000
  n_tofix = n.toFixed(2)
  document.getElementById('Actual_average_daily_output').innerHTML = $.i18n.prop('average_daily_output', n_tofix)
  console.log('n', n)
  nmin = 0.4 * Min_Daily_Eruption
  console.log('nmin', nmin)
  fixDailyErup = RT_Eruption * 0.6 * Eruption_Period_Min_Num / Eruption_Period_Min_Num
  fixAcitvePercent = Acitve_Period_Min_Num / Acitve_Period_Max_Num
  console.log('fixDailyErup', fixDailyErup)
  console.log('fixAcitvePercent', fixAcitvePercent)
  fix_n = numfix(fixDailyErup, Min_Daily_Eruption, Max_Daily_Eruption) * numfix(fixAcitvePercent, 0.4, 0.8)
  x = fix_n / nmin * 600
  console.log('x', x)
  k = Max_Daily_Eruption / Min_Daily_Eruption
  console.log('k', k)

}

function geyser_tile () {
  geyser_tile_cycle = n_tofix * 600 / geyser_tile_one
  document.getElementById('geyser_tile_cycle_output').innerHTML = $.i18n.prop('geyser_tile_cycle_output', geyser_tile_one, geyser_tile_cycle.toFixed(2))
}

function use_up () {
  document.getElementById('use_up_information').innerHTML = ''
  document.getElementById('Bristle_Blossom').innerHTML = ''
  document.getElementById('Sleet_Wheat').innerHTML = ''
  document.getElementById('Pincha_Pepper').innerHTML = ''
  document.getElementById('Thimble_Reed').innerHTML = ''
  document.getElementById('Electrolyzer').innerHTML = ''
  document.getElementById('Fertilizer_Synthesizer').innerHTML = ''
  document.getElementById('Carbon_Skimmer').innerHTML = ''
  console.log('geyser_tpye', geyser_tpye)

  if (geyser_tpye == 'fluid') {

    Bristle_Blossom = 33.33
    Sleet_Wheat = 33.33
    Pincha_Pepper = 58.33
    Thimble_Reed = 266.67
    Electrolyzer = 1000
    Fertilizer_Synthesizer = 150
    Carbon_Skimmer = 1000

    Bristle_Blossom_count = n * 1000 / Bristle_Blossom
    Sleet_Wheat_count = n * 1000 / Sleet_Wheat
    Pincha_Pepper_count = n * 1000 / Pincha_Pepper
    Thimble_Reed_count = n * 1000 / Thimble_Reed
    Electrolyzer_count = n * 1000 / Electrolyzer
    Fertilizer_Synthesizer_count = n * 1000 / Fertilizer_Synthesizer
    Carbon_Skimmer_count = n * 1000 / Carbon_Skimmer

    document.getElementById('use_up_information').innerHTML = $.i18n.prop('use_up_information')
    document.getElementById('Bristle_Blossom').innerHTML = $.i18n.prop('Bristle_Blossom', Bristle_Blossom, Bristle_Blossom_count.toFixed(2))
    document.getElementById('Sleet_Wheat').innerHTML = $.i18n.prop('Sleet_Wheat', Sleet_Wheat, Sleet_Wheat_count.toFixed(2))
    document.getElementById('Pincha_Pepper').innerHTML = $.i18n.prop('Pincha_Pepper', Pincha_Pepper, Pincha_Pepper_count.toFixed(2))
    document.getElementById('Thimble_Reed').innerHTML = $.i18n.prop('Thimble_Reed', Thimble_Reed, Thimble_Reed_count.toFixed(2))
    document.getElementById('Electrolyzer').innerHTML = $.i18n.prop('Electrolyzer', Electrolyzer, Electrolyzer_count.toFixed(2))
    document.getElementById('Fertilizer_Synthesizer').innerHTML = $.i18n.prop('Fertilizer_Synthesizer', Fertilizer_Synthesizer, Fertilizer_Synthesizer_count.toFixed(2))
    document.getElementById('Carbon_Skimmer').innerHTML = $.i18n.prop('Carbon_Skimmer', Carbon_Skimmer, Carbon_Skimmer_count.toFixed(2))

  }
}

function geyser_persent (x, k) {
  var e = 2.72
  lnx = Math.log(x) / Math.log(e)
  if (x < 2) {
    better_persent = (x * lnx - x + 1) / (k - 1)
    console.log('x<2,better_persent', better_persent)
    geyser_better_persent_view = Math.round(better_persent * 100)
    document.getElementById('geyser_better_persent').innerHTML = $.i18n.prop('better_than', geyser_better_persent_view)
  } else if (2 < x && x < k) {
    better_persent = (x * Math.LN2 - 1) / (k - 1)
    console.log('2 < x && x < k , better_persent', better_persent)
    geyser_better_persent_view = Math.round(better_persent * 100)
    document.getElementById('geyser_better_persent').innerHTML = $.i18n.prop('better_than', geyser_better_persent_view)
  } else if (k < x) {
    twokx = (2 * k) / x
    twokx_log = Math.log(twokx) / Math.log(e)
    better_persent = (x * twokx_log + x - 2 * k) / (k - 1) + 1
    console.log('k < x , better_persent', better_persent)
    geyser_better_persent_view = Math.round(better_persent * 100)
    document.getElementById('geyser_better_persent').innerHTML = $.i18n.prop('better_than', geyser_better_persent_view)
  }
}

function start () {
  geyser_tpye = null
  geyser_name = document.getElementById('Geyser_type').value
  console.log('geyser_name', geyser_name)
  Daily_Eruption_duge(geyser_name)
  console.log('Min_Daily_Eruption', Min_Daily_Eruption)
  console.log('Max_Daily_Eruption', Max_Daily_Eruption)
  cal_x_k()
  geyser_persent(x, k)
  geyser_tile()
  use_up()
}

function Daily_Eruption_duge (geyser_name) {
  if (geyser_name == 'Cool_Steam_Vent') {
    Min_Daily_Eruption = Cool_Steam_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Cool_Steam_Vent.Max_Daily_Eruption
    geyser_tile_one = Cool_Steam_Vent.store_tile_one
    geyser_tpye = 'fluid'
  } else if (geyser_name == 'Steam_Vent') {
    Min_Daily_Eruption = Steam_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Steam_Vent.Max_Daily_Eruption
    geyser_tile_one = Steam_Vent.store_tile_one
    geyser_tpye = 'fluid'

  } else if (geyser_name == 'Water_Geyser') {
    Min_Daily_Eruption = Water_Geyser.Min_Daily_Eruption
    Max_Daily_Eruption = Water_Geyser.Max_Daily_Eruption
    geyser_tile_one = Water_Geyser.store_tile_one
    geyser_tpye = 'fluid'

  } else if (geyser_name == 'Cool_Slush_Geyser') {
    Min_Daily_Eruption = Cool_Slush_Geyser.Min_Daily_Eruption
    Max_Daily_Eruption = Cool_Slush_Geyser.Max_Daily_Eruption
    geyser_tile_one = Cool_Slush_Geyser.store_tile_one
    geyser_tpye = 'fluid'

  } else if (geyser_name == 'Polluted_Water_Vent') {
    Min_Daily_Eruption = Polluted_Water_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Polluted_Water_Vent.Max_Daily_Eruption
    geyser_tile_one = Polluted_Water_Vent.store_tile_one
    geyser_tpye = 'fluid'

  } else if (geyser_name == 'Minor_Volcano') {
    Min_Daily_Eruption = Minor_Volcano.Min_Daily_Eruption
    Max_Daily_Eruption = Minor_Volcano.Max_Daily_Eruption
    geyser_tile_one = Minor_Volcano.store_tile_one

  } else if (geyser_name == 'Volcano') {
    Min_Daily_Eruption = Volcano.Min_Daily_Eruption
    Max_Daily_Eruption = Volcano.Max_Daily_Eruption
    geyser_tile_one = Volcano.store_tile_one

  } else if (geyser_name == 'Carbon_Dioxide_Geyser') {
    Min_Daily_Eruption = Carbon_Dioxide_Geyser.Min_Daily_Eruption
    Max_Daily_Eruption = Carbon_Dioxide_Geyser.Max_Daily_Eruption
    geyser_tile_one = Carbon_Dioxide_Geyser.store_tile_one

  } else if (geyser_name == 'Carbon_Dioxide_Vent') {
    Min_Daily_Eruption = Carbon_Dioxide_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Carbon_Dioxide_Vent.Max_Daily_Eruption
    geyser_tile_one = Carbon_Dioxide_Vent.store_tile_one

  } else if (geyser_name == 'Hydrogen_Vent') {
    Min_Daily_Eruption = Hydrogen_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Hydrogen_Vent.Max_Daily_Eruption
    geyser_tile_one = Hydrogen_Vent.store_tile_one

  } else if (geyser_name == 'Polluted_Oxygen_Vent') {
    Min_Daily_Eruption = Polluted_Oxygen_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Polluted_Oxygen_Vent.Max_Daily_Eruption
    geyser_tile_one = Polluted_Oxygen_Vent.store_tile_one

  } else if (geyser_name == 'Infectious_Polluted_Oxygen_Vent') {
    Min_Daily_Eruption = Infectious_Polluted_Oxygen_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Infectious_Polluted_Oxygen_Vent.Max_Daily_Eruption
    geyser_tile_one = Infectious_Polluted_Oxygen_Vent.store_tile_one

  } else if (geyser_name == 'Chlorine_Gas_Vent') {
    Min_Daily_Eruption = Chlorine_Gas_Vent.Min_Daily_Eruption
    Max_Daily_Eruption = Chlorine_Gas_Vent.Max_Daily_Eruption
    geyser_tile_one = Chlorine_Gas_Vent.store_tile_one

  } else if (geyser_name == 'Natural_Gas_Geyser') {
    Min_Daily_Eruption = Natural_Gas_Geyser.Min_Daily_Eruption
    Max_Daily_Eruption = Natural_Gas_Geyser.Max_Daily_Eruption
    geyser_tile_one = Natural_Gas_Geyser.store_tile_one

  } else if (geyser_name == 'Copper_Volcano') {
    Min_Daily_Eruption = Copper_Volcano.Min_Daily_Eruption
    Max_Daily_Eruption = Copper_Volcano.Max_Daily_Eruption
    geyser_tile_one = Copper_Volcano.store_tile_one

  } else if (geyser_name == 'Iron_Volcano') {
    Min_Daily_Eruption = Iron_Volcano.Min_Daily_Eruption
    Max_Daily_Eruption = Iron_Volcano.Max_Daily_Eruption
    geyser_tile_one = Iron_Volcano.store_tile_one

  } else if (geyser_name == 'Gold_Volcano') {
    Min_Daily_Eruption = Gold_Volcano.Min_Daily_Eruption
    Max_Daily_Eruption = Gold_Volcano.Max_Daily_Eruption
    geyser_tile_one = Gold_Volcano.store_tile_one

  } else if (geyser_name == 'Leaky_Oil_Fissure') {
    Min_Daily_Eruption = Leaky_Oil_Fissure.Min_Daily_Eruption
    Max_Daily_Eruption = Leaky_Oil_Fissure.Max_Daily_Eruption
    geyser_tile_one = Leaky_Oil_Fissure.store_tile_one

  }
}

var Cool_Steam_Vent = {
  Min_Daily_Eruption: 200,
  Max_Daily_Eruption: 2500,
  store_tile_one: 20,
}

var Steam_Vent = {
  Min_Daily_Eruption: 10,
  Max_Daily_Eruption: 100,
  store_tile_one: 20,
}

var Water_Geyser = {
  Min_Daily_Eruption: 500,
  Max_Daily_Eruption: 5000,
  store_tile_one: 1000,
}

var Cool_Slush_Geyser = {
  Min_Daily_Eruption: 500,
  Max_Daily_Eruption: 5000,
  store_tile_one: 1000,
}

var Polluted_Water_Vent = {
  Min_Daily_Eruption: 500,
  Max_Daily_Eruption: 5000,
  store_tile_one: 1000,
}

var Minor_Volcano = {
  Min_Daily_Eruption: 100,
  Max_Daily_Eruption: 1000,
  store_tile_one: 1840,
}

var Volcano = {
  Min_Daily_Eruption: 200,
  Max_Daily_Eruption: 2000,
  store_tile_one: 1840,
}

var Carbon_Dioxide_Geyser = {
  Min_Daily_Eruption: 3,
  Max_Daily_Eruption: 30,
  store_tile_one: 2000,
}

var Carbon_Dioxide_Vent = {
  Min_Daily_Eruption: 5,
  Max_Daily_Eruption: 50,
  store_tile_one: 20,
}

var Hydrogen_Vent = {
  Min_Daily_Eruption: 5,
  Max_Daily_Eruption: 50,
  store_tile_one: 20,
}

var Polluted_Oxygen_Vent = {
  Min_Daily_Eruption: 15,
  Max_Daily_Eruption: 180,
  store_tile_one: 20,
}

var Infectious_Polluted_Oxygen_Vent = {
  Min_Daily_Eruption: 15,
  Max_Daily_Eruption: 180,
  store_tile_one: 20,
}

var Chlorine_Gas_Vent = {
  Min_Daily_Eruption: 15,
  Max_Daily_Eruption: 180,
  store_tile_one: 20,
}

var Natural_Gas_Geyser = {
  Min_Daily_Eruption: 15,
  Max_Daily_Eruption: 180,
  store_tile_one: 20,

}

var Copper_Volcano = {
  Min_Daily_Eruption: 50,
  Max_Daily_Eruption: 500,
  store_tile_one: 3870,

}

var Iron_Volcano = {
  Min_Daily_Eruption: 50,
  Max_Daily_Eruption: 500,
  store_tile_one: 7870,

}

var Gold_Volcano = {
  Min_Daily_Eruption: 50,
  Max_Daily_Eruption: 500,
  store_tile_one: 9970,

}

var Leaky_Oil_Fissure = {
  Min_Daily_Eruption: 1,
  Max_Daily_Eruption: 250,
  store_tile_one: 870,

}
