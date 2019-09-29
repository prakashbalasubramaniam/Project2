import pandas as pd

def populate_linechartdata():
    # read manual modified file
    df_athlete = pd.read_csv("../Project2/data/line_chart_data.csv")
    df_athlete = df_athlete.astype(str)
    linechartdict = {}
    linechartlist = []
    for i in range(len(df_athlete)):
        linechartdict["year"] = df_athlete.iloc[i,0]
        linechartdict["sex"] = df_athlete.iloc[i,1]
        linechartdict["season"] = df_athlete.iloc[i,2]
        linechartdict["medal"] = df_athlete.iloc[i,3]
        linechartdict["season_sex"] = df_athlete.iloc[i,4]
        linechartlist.append(linechartdict)    
        linechartdict = {}
    linechartdict_all = {}
    linechartdict_all["all_data"] = linechartlist
    return linechartdict_all
    