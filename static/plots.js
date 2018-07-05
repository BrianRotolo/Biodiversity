function start(){
  showpanelMeta("BB_940");
  showPie("BB_940");
  showBubble("BB_940");
}

function findNames() {
  Plotly.d3.json("/names", function(error, response) {
      //Use document.getElementById, document.createElement and append to populate the create option elements and append them to the dropdown selector.
    var selDataset = document.getElementById("selDataset");
    for (i = 0; i < response.length; i++){
      var option = document.createElement("option");
      option.text = response[i];
      option.value = response[i];
      selDataset.appendChild(option);        
    }
  });
}

function showpanelMeta(sample){
  Plotly.d3.json(`/metadata/${sample}`, function(error, response) {
    var panelMetadata = document.getElementById("panelMetadata");
    panelMetadata.innerHTML = "";
    for (var key in response){
      panelMetadata.innerHTML += key + ": " + response[key] + "<br>";   
    }
  }); 
}

function optionChanged(sample){
    //  <select id="selDataset" onchange="optionChanged(this.value)"></select>
  showpanelMeta(sample);
  updatePie(sample);
  updateBubble(sample);
}

function showPie(sample){
  Plotly.d3.json(`/samples/${sample}`, function(error, response) {
//Use the Sample Value as the values for the PIE chart
//Use the OTU ID as the labels for the pie chart
//Use the OTU Description as the hovertext for the chart
    var pieLabels = response['otu_ids'].slice(0,10);
    var pieValues = response['sample_values'].slice(0,10);
    var data = [{
      labels: pieLabels,
      values: pieValues,
      type: "pie",
      hoverinfo: 'label'
    }];
    var layout = {
      height: 500,
      width: 500
    };
    Plotly.plot("pie", data, layout);
  }); 
}

function updatePie(sample){
  Plotly.d3.json(`/samples/${sample}`, function(error, response) {
    var newValues = response['sample_values'].slice(0,10);
    var newLabels = response['otu_ids'].slice(0,10);
    var PIE = document.getElementById("pie");
    //Use Plotly.restyle to update the chart whenever a new sample is selected
    Plotly.restyle(PIE, "values", [newValues]);
    Plotly.restyle(PIE, "labels", [newLabels]);
  });
}

function showBubble(sample){
    Plotly.d3.json(`/samples/${sample}`, function(error, response) {
//Use the OTU IDs for the x values
//Use the Sample Values for the y values
//Use the Sample Values for the marker size
//Use the OTU IDs for the marker colors
//Use the OTU Description Data for the text values
      var otuIDs = response['otu_ids'];
      var sampleValues = response['sample_values'];
      var trace = [{
        x: otuIDs,
        y: sampleValues,
        mode: "markers",
        marker: { 
          size: sampleValues,
          color: otuIDs
        }
      }];
      var layout = {
        height: 600,
        width: 1100
      }
      Plotly.plot("bubble", trace, layout);
    }); 
  }

function updateBubble(sample){
    Plotly.d3.json(`/samples/${sample}`, function(error, response) {
      var otuIDs = response['otu_ids'];
      var sampleValues = response['sample_values'];
      var Bubble = document.getElementById("bubble");
      //Use Plotly.restyle to update the chart whenever a new sample is selected
      Plotly.restyle(Bubble, "x", [otuIDs]);
      Plotly.restyle(Bubble, "y", [sampleValues]);
    });
  }

findNames();
start();