function setUpTangle () {

    var element = document.getElementById("tangle-legend");

    var tangle = new Tangle(element, {
        initialize: function () {
            this.legendDomain = tredis.legend_domain;
            this.zero = (tredis.legend_domain[0]/1000).toFixed(2)*1;
            this.one = (tredis.legend_domain[1]/1000).toFixed(2)*1;
            this.two = (tredis.legend_domain[2]/1000).toFixed(2)*1;
            this.three = (tredis.legend_domain[3]/1000).toFixed(2)*1;
            this.four = (tredis.legend_domain[4]/1000).toFixed(2)*1;
            this.five = (tredis.legend_domain[5]/1000).toFixed(2)*1;
            this.six = (tredis.legend_domain[6]/1000).toFixed(2)*1;
            this.seven = (tredis.legend_domain[7]/1000).toFixed(2)*1;
            this.eight = (tredis.legend_domain[8]/1000).toFixed(2)*1;
            this.nine = (tredis.legend_domain[9]/1000).toFixed(2)*1;
            

        },
        update: function () {
            //
            var inputs = [this.zero,this.one,this.two,this.three,this.four,this.five,this.six,this.seven,this.eight,this.nine];
            var new_domain = [];
            inputs.forEach(function(d){

                if(!isNaN(d)){
                    new_domain.push(d*1000);
                }
            });
           
            tredis.threshold.domain(new_domain);
            tredis.updateMap();
        }
    });
}