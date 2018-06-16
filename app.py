from flask import Flask,render_template,jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)

@app.route("/")
def index():
    return  render_template("index.html")

@app.route("/names")
def names():
    df_names= pd.read_csv('DataSets/belly_button_biodiversity_samples.csv')
    names_list = []
    for each_name in df_names.columns[1:]:
        names_list.append(each_name)   
    names_list = names_list
    return jsonify(names_list)

@app.route("/otu")
def otu():
    df_otu_id = pd.read_csv("DataSets/belly_button_biodiversity_otu_id.csv")
    otu_list = []
    for each_otu_id in df_otu_id['lowest_taxonomic_unit_found']:
        otu_list.append(each_otu_id) 
    return jsonify(otu_list)

@app.route("/metadata/sample")
def metadata_sample():
    df_meta_sample = pd.read_csv("DataSets/Belly_Button_Biodiversity_Metadata.csv")
    df_meta_sample["SAMPLEID"]="BB_" + df_meta_sample["SAMPLEID"].astype(str)
    df_meta_sample = df_meta_sample[['AGE','BBTYPE','ETHNICITY','GENDER','LOCATION','SAMPLEID']]
    df_meta_sample_JSON = df_meta_sample.to_json(orient='records')
    return df_meta_sample_JSON

@app.route("/wfreq/sample")
def wfreq():
    df_meta_sample = pd.read_csv("DataSets/Belly_Button_Biodiversity_Metadata.csv")
    df_meta_sample['SAMPLEID'] = "BB_" + df_meta_sample["SAMPLEID"].astype(str)
    df_meta_sample_wfreq = df_meta_sample[['SAMPLEID','WFREQ']]
    df_meta_sample_wfreq = df_meta_sample_wfreq.fillna(0) 
    df_meta_sample_wfreq = df_meta_sample_wfreq.to_json(orient='records')
    return df_meta_sample_wfreq

@app.route('/samples/<sample>')
def sample_samples():
    df_biodio = pd.read_csv('DataSets/belly_button_biodiversity_samples.csv')
    df_otu = pd.read_csv("DataSets/belly_button_biodiversity_otu_id.csv")
    df_biodio_merged = df_biodio.merge(df_otu, on=['otu_id'],how='outer')
    df_biodio_merged["Total"] = df_biodio_merged.iloc[::,1:].sum(axis=1)
    df_biodio_sorted = df_biodio_merged[['otu_id','lowest_taxonomic_unit_found', 'Total']]
    df_biodio_sorted = df_biodio_sorted.sort_values(by=['Total'],ascending=False)
    return df_biodio_sorted.to_json(orient='records')

if __name__ == "__main__":
    app.run(debug=True)
