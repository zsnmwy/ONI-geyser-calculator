/* eslint-disable */
function get_input() {
    RT_Eruption = $('#input_RT_Eruption').val().trim();
    Eruption_Period_Min_Num = Number($('#input_Eruption_Period_Min').val().trim());
    Eruption_Period_Max_Num = Number($('#input_Eruption_Period_Max').val().trim());
    Acitve_Period_Min_Num = Number($('#input_Acitve_Period_Min').val().trim());
    Acitve_Period_Max_Num = Number($('#input_Acitve_Period_Max').val().trim());

    // 最小值大于最大值时交换

    if (Eruption_Period_Min_Num > Eruption_Period_Max_Num) {
        [Eruption_Period_Min_Num, Eruption_Period_Max_Num] =  [Eruption_Period_Max_Num, Eruption_Period_Min_Num];
    }

    if (Acitve_Period_Min_Num > Acitve_Period_Max_Num) {
        [Acitve_Period_Min_Num, Acitve_Period_Max_Num] =  [Acitve_Period_Max_Num, Acitve_Period_Min_Num];
    }

    console.log('RT Eruption',RT_Eruption);
    console.log('Eruption_Period_Min_Num',Eruption_Period_Min_Num);
    console.log('Eruption_Period_Max_Num',Eruption_Period_Max_Num);
    console.log('Acitve_Period_Min_Num',Acitve_Period_Min_Num);
    console.log('Acitve_Period_Max_Num',Acitve_Period_Max_Num);
}

function cal_x_k() {
    get_input();
    n = (Eruption_Period_Min_Num * RT_Eruption * Acitve_Period_Min_Num) / Acitve_Period_Max_Num / Eruption_Period_Max_Num / 1000;
    n_tofix = n.toFixed(2);
    document.getElementById("Actual_average_daily_output").innerHTML = $.i18n.prop('average_daily_output', n_tofix);
    console.log('n', n);
    nmin = 0.4 * Min_Daily_Eruption;
    console.log('nmin', nmin);
    x = n / nmin * 600;
    console.log('x', x);
    k = Max_Daily_Eruption / Min_Daily_Eruption;
    console.log('k', k);
}

function geyser_persent(x, k) {
    var e = 2.72;
    lnx = Math.log(x) / Math.log(e);
    if (x < 2) {
        better_persent = (x * lnx - x + 1) / (k - 1);
        console.log('x<2,better_persent', better_persent);
        geyser_better_persent_view = Math.round(better_persent * 100);
        document.getElementById("geyser_better_persent").innerHTML = $.i18n.prop('batter_than', geyser_better_persent_view);
    } else if (2 < x && x < k) {
        better_persent = (x * Math.LN2 - 1) / (k - 1);
        console.log('2 < x && x < k , better_persent', better_persent);
        geyser_better_persent_view = Math.round(better_persent * 100);
        document.getElementById("geyser_better_persent").innerHTML = $.i18n.prop('batter_than', geyser_better_persent_view);
    } else if (k < x) {
        twokx = (2 * k) / x;
        twokx_log = Math.log(twokx) / Math.log(e);
        better_persent = (x * twokx_log + x - 2 * k) / (k - 1) + 1;
        console.log('k < x , better_persent', better_persent);
        geyser_better_persent_view = Math.round(better_persent * 100);
        document.getElementById("geyser_better_persent").innerHTML = $.i18n.prop('batter_than', geyser_better_persent_view);
    }
}

function start() {
    geyser_name = document.getElementById("Geyser_type").value;
    console.log('geyser_name', geyser_name);
    Daily_Eruption_duge(geyser_name);
    console.log('Min_Daily_Eruption', Min_Daily_Eruption);
    console.log('Max_Daily_Eruption', Max_Daily_Eruption);
    cal_x_k();
    geyser_persent(x, k);
}

function Daily_Eruption_duge(geyser_name) {
    if (geyser_name == 'Cool_Steam_Vent') {
        Min_Daily_Eruption = Cool_Steam_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Cool_Steam_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Steam_Vent') {
        Min_Daily_Eruption = Steam_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Steam_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Water_Geyser') {
        Min_Daily_Eruption = Water_Geyser.Min_Daily_Eruption;
        Max_Daily_Eruption = Water_Geyser.Max_Daily_Eruption;
    } else if (geyser_name == 'Cool_Slush_Geyser') {
        Min_Daily_Eruption = Cool_Slush_Geyser.Min_Daily_Eruption;
        Max_Daily_Eruption = Cool_Slush_Geyser.Max_Daily_Eruption;
    } else if (geyser_name == 'Polluted_Water_Vent') {
        Min_Daily_Eruption = Polluted_Water_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Polluted_Water_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Minor_Volcano') {
        Min_Daily_Eruption = Minor_Volcano.Min_Daily_Eruption;
        Max_Daily_Eruption = Minor_Volcano.Max_Daily_Eruption;
    } else if (geyser_name == 'Volcano') {
        Min_Daily_Eruption = Volcano.Min_Daily_Eruption;
        Max_Daily_Eruption = Volcano.Max_Daily_Eruption;
    } else if (geyser_name == 'Carbon_Dioxide_Geyser') {
        Min_Daily_Eruption = Carbon_Dioxide_Geyser.Min_Daily_Eruption;
        Max_Daily_Eruption = Carbon_Dioxide_Geyser.Max_Daily_Eruption;
    } else if (geyser_name == 'Carbon_Dioxide_Vent') {
        Min_Daily_Eruption = Carbon_Dioxide_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Carbon_Dioxide_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Hydrogen_Vent') {
        Min_Daily_Eruption = Hydrogen_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Hydrogen_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Polluted_Oxygen_Vent') {
        Min_Daily_Eruption = Polluted_Oxygen_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Polluted_Oxygen_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Infectious_Polluted_Oxygen_Vent') {
        Min_Daily_Eruption = Infectious_Polluted_Oxygen_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Infectious_Polluted_Oxygen_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Chlorine_Gas_Vent') {
        Min_Daily_Eruption = Chlorine_Gas_Vent.Min_Daily_Eruption;
        Max_Daily_Eruption = Chlorine_Gas_Vent.Max_Daily_Eruption;
    } else if (geyser_name == 'Natural_Gas_Geyser') {
        Min_Daily_Eruption = Natural_Gas_Geyser.Min_Daily_Eruption;
        Max_Daily_Eruption = Natural_Gas_Geyser.Max_Daily_Eruption;
    } else if (geyser_name == 'Copper_Volcano') {
        Min_Daily_Eruption = Copper_Volcano.Min_Daily_Eruption;
        Max_Daily_Eruption = Copper_Volcano.Max_Daily_Eruption;
    } else if (geyser_name == 'Iron_Volcano') {
        Min_Daily_Eruption = Iron_Volcano.Min_Daily_Eruption;
        Max_Daily_Eruption = Iron_Volcano.Max_Daily_Eruption;
    } else if (geyser_name == 'Gold_Volcano') {
        Min_Daily_Eruption = Gold_Volcano.Min_Daily_Eruption;
        Max_Daily_Eruption = Gold_Volcano.Max_Daily_Eruption;
    } else if (geyser_name == 'Leaky_Oil_Fissure') {
        Min_Daily_Eruption = Leaky_Oil_Fissure.Min_Daily_Eruption;
        Max_Daily_Eruption = Leaky_Oil_Fissure.Max_Daily_Eruption;
    }
}


var Cool_Steam_Vent = {
    Min_Daily_Eruption: 200,
    Max_Daily_Eruption: 2500,
};

var Steam_Vent = {
    Min_Daily_Eruption: 10,
    Max_Daily_Eruption: 100,
};

var Water_Geyser = {
    Min_Daily_Eruption: 500,
    Max_Daily_Eruption: 5000,
};

var Cool_Slush_Geyser = {
    Min_Daily_Eruption: 500,
    Max_Daily_Eruption: 5000,
};

var Polluted_Water_Vent = {
    Min_Daily_Eruption: 500,
    Max_Daily_Eruption: 5000,
};

var Minor_Volcano = {
    Min_Daily_Eruption: 100,
    Max_Daily_Eruption: 1000,
};

var Volcano = {
    Min_Daily_Eruption: 200,
    Max_Daily_Eruption: 2000,
};

var Carbon_Dioxide_Geyser = {
    Min_Daily_Eruption: 3,
    Max_Daily_Eruption: 30,
};

var Carbon_Dioxide_Vent = {
    Min_Daily_Eruption: 5,
    Max_Daily_Eruption: 50,
};

var Hydrogen_Vent = {
    Min_Daily_Eruption: 5,
    Max_Daily_Eruption: 50,
};

var Polluted_Oxygen_Vent = {
    Min_Daily_Eruption: 15,
    Max_Daily_Eruption: 180,
};

var Infectious_Polluted_Oxygen_Vent = {
    Min_Daily_Eruption: 15,
    Max_Daily_Eruption: 180,
};

var Chlorine_Gas_Vent = {
    Min_Daily_Eruption: 15,
    Max_Daily_Eruption: 180,
};

var Natural_Gas_Geyser = {
    Min_Daily_Eruption: 10,
    Max_Daily_Eruption: 100,
};

var Copper_Volcano = {
    Min_Daily_Eruption: 50,
    Max_Daily_Eruption: 500,
};


var Iron_Volcano = {
    Min_Daily_Eruption: 50,
    Max_Daily_Eruption: 500,
};


var Gold_Volcano = {
    Min_Daily_Eruption: 50,
    Max_Daily_Eruption: 500,
};

var Leaky_Oil_Fissure = {
    Min_Daily_Eruption: 1,
    Max_Daily_Eruption: 250,
};
