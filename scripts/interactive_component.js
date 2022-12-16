d3.csv("age-distribution.csv", function (d){
            return {
                year : +d.year,
                age : d.age,
                value : +d.value,
            };
        }).then(function(data) {
            var date = "1950";
            var initialData = getYearData(date);
            var yAxisLabels = getAgeData();
            //Set up margins
            var margin = { top: 60, right: 80, bottom: 60, left: 60 };
            var width  = 400 - margin.left - margin.right;
            var height = 600 - margin.top  - margin.bottom;
            
            // Make y scale
            var yScale = d3.scaleBand()
                    .domain(yAxisLabels)
                    .range([0, height])
                    .padding(0.1);

            //make x scale
            var xScale = d3.scaleLinear()
                .range([0, width])
                .domain([0, 15]);

            //Create canvas
            var canvas = d3.select("#vis-container")
                  .append("svg")
                    .attr("width",  width  + margin.left + margin.right)
                    .attr("height", height + margin.top  + margin.bottom)
                  .append("g")
                    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            // Make y-axis and add to canvas
            var yAxis = d3.axisLeft(yScale);
                canvas.append("g")
                        .attr("class", "y axis")
                        .call(yAxis);
                canvas.append("text")
                        .style("text-anchor", "end")
                        .text("Age Group")
                        .attr("x", -5)
                        .style("font-size", "12px")
                canvas.append("text")
                    .text("Age Distribution of the World in 1950")
                    .attr("id", "title")
                    .attr("y",-40)
                canvas.append("text")
                    .text("Year")
                    .attr("x", width/3)
                    .attr("y", height+25);
            // Make x-axis and add to canvas
            var xAxis = d3.axisTop(xScale)
                .tickFormat(d => d + "%");
                canvas.append("g")
                    .attr("class", "x axis")
                    .call(xAxis);
                canvas.append("text")
                    .style("text-anchor", "center")
                    .attr("y", -25)
                    .attr("x", width/3)
                    .style("font-size", "12px")
                    .text("Population Percentage");

                canvas.append("select")
                    .attr("id", "selectButton");
            
            //Update bars based upon new data
            function updateBars(updated_data){
                //Update title
                /*var selection = d3.select("#vis-container");
                selection.selectAll("text").remove();
                selection.append("text")
                    .attr("text-anchor", "middle")
                    .text("Age Distribution of the World in " + date);*/
                 // First update the y-axis domain to match data
                 var bars = canvas.selectAll(".bar").data(updated_data);
                
                // Add bars for new data
                bars.enter()
                .append("rect")
                    .attr("class", "bar")
                    .attr("y", function(d,i) { return yScale( yAxisLabels[i] ); })
                    .attr("height", 20)
                    .attr("x", function(d,i) { return xScale(d); })
                    .attr("width", function(d) { return xScale(d.value*100); })
                    .style("fill", "#ff8e00");

                // Update old ones, already have y / height from before
                bars
                    .transition().duration(250)
                    .attr("y", function(d,i) { return yScale( yAxisLabels[i] ); })
                    .attr("height", 20)
                    .attr("x", function(d,i) { return xScale(d); })
                    .attr("width", function(d) { return xScale(d.value*100); })
                    .style("fill", "#ff8e00");

                // Remove old ones
                bars.exit().remove();    
                
                //Iteratively change the title
                var title = canvas.select("#title").data(updated_data);
                title.transition().duration(250)
                        .text("Age Distribution of the World in " + updated_data[0].year)
                        .attr("y",-40);

            }

            // Handler for dropdown value change
            var dropdownChange = function() {
                    var newYear = d3.select(this).property('value'),
                        newData = getYearData(newYear);
                    date = newYear;
                    updateBars(newData);
            };

            //Handles getting the data from the array
            function getYearData(newYear) {
                newData = [];
                for (let i = 0; i < data.length; i++) {
                    if (data[i].year.toString() === newYear.toString()){
                        newData.push(data[i]);
                    }
                }
                return newData;
            }
            //Handles getting age groups for axis
            function getAgeData() {
                allAgeGroups = [];
                for (let i = 0; i < initialData.length; i++) {
                        allAgeGroups.push(initialData[i].age.toString());
                }
                return allAgeGroups;
            }
            //Variable containing all the years for dropdown
            var allYears = data.map(item => item.year).filter((value, index, self) => self.indexOf(value) === index);

            //Create separate canvas for button
            //Creation of dropdown menu
            var dropdown = d3.select("#dropButton")
                    .on("change", dropdownChange);

                dropdown.selectAll("option")
                    .data(allYears)
                    .enter().append("option")
                    .attr("value", function (d) { return d; })
                    .text(function (d) {
                        return d;
                    });
            updateBars(initialData);
        });
