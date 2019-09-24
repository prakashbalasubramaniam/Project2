import pandas as pd
def olympic_crud():
    # read csv file athlete_events
    df_athlete = pd.read_csv("../Project2/data/athlete_events.csv")
    # read csv file noc_regions
    df_noc = pd.read_csv("../Project2/data/noc_regions.csv")
    # merge noc_regions and athlete_events on NOC column
    athlete_noc_pd = pd.merge(df_athlete, df_noc, on='NOC', how='outer')
    # rename region column to Country
    athlete_noc_pd = athlete_noc_pd.rename(columns={'region': 'Country'})
    # replace NaN in Medal column to 0
    athlete_noc_pd[['Medal']] = athlete_noc_pd[['Medal']].fillna(value=0)
    # read csv file Countries_LatLng
    df_latlng = pd.read_csv("../Project2/data/Countries_LatLng.csv")
    # merge athlete_noc_pd with  Countries_LatLng on Country
    athlete_noc_latlng_pd = pd.merge(athlete_noc_pd, df_latlng, on='Country', how='outer')
    # reset index to ID
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.set_index('ID')
    # drop columns notes, Lat and Lng
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.drop(["notes", "Lat", "Lng"], axis=1)
    # rename Latitude (generated) and Longitude (generated) to Lat and Lng respectively
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.rename(columns={'Latitude (generated)': 'Lat'})
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.rename(columns={'Longitude (generated)': 'Lng'})
    # remove rows with Medal = 0 to fix pymongo upload limit of 16MB
    athlete_noc_latlng_pd = athlete_noc_latlng_pd[athlete_noc_latlng_pd.Medal != 0]
    # save athlete_noc_latlng_pd to athlete_noc.csv  
    athlete_noc_latlng_pd.to_csv('../Project2/data/athlete_noc.csv')
    # reset index for athlete_noc_latlng_pd
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.reset_index()
    # convert dataframe to string to fix pymongo upload numpy int64 issue
    athlete_noc_latlng_pd = athlete_noc_latlng_pd.astype(str)
    # define a list for holding dictionary data
    olympics_list = []
    # define a dictionary placeholder for saved variables
    olympics_dict = {}
    # loop and convert read data from dataframe into dictionary and append to olympics_list 
    for i in range(len(athlete_noc_latlng_pd)):
        olympics_dict["id"] = athlete_noc_latlng_pd.iloc[i,0]
        olympics_dict["name"] = athlete_noc_latlng_pd.iloc[i,1]
        olympics_dict["sex"] = athlete_noc_latlng_pd.iloc[i,2]
        olympics_dict["age"] = athlete_noc_latlng_pd.iloc[i,3]
        olympics_dict["height"] = athlete_noc_latlng_pd.iloc[i,4]
        olympics_dict["weight"] = athlete_noc_latlng_pd.iloc[i,5]
        olympics_dict["team"] = athlete_noc_latlng_pd.iloc[i,6]
        olympics_dict["noc"] = athlete_noc_latlng_pd.iloc[i,7]
        olympics_dict["games"] = athlete_noc_latlng_pd.iloc[i,8]
        olympics_dict["year"] = athlete_noc_latlng_pd.iloc[i,9]
        olympics_dict["season"] = athlete_noc_latlng_pd.iloc[i,10]
        olympics_dict["city"] = athlete_noc_latlng_pd.iloc[i,11]
        olympics_dict["sport"] = athlete_noc_latlng_pd.iloc[i,12]
        olympics_dict["event"] = athlete_noc_latlng_pd.iloc[i,13]
        olympics_dict["medal"] = athlete_noc_latlng_pd.iloc[i,14]
        olympics_dict["country"] = athlete_noc_latlng_pd.iloc[i,15]
        olympics_dict["lat"] = athlete_noc_latlng_pd.iloc[i,16]
        olympics_dict["lng"] = athlete_noc_latlng_pd.iloc[i,17]
        olympics_list.append(olympics_dict)
        # reset dictionary placeholder for next entry
        olympics_dict = {}
    # return populated list to caller
    #return olympics_list
    olympics_dict_all = {}
    olympics_dict_all["all_data"] = olympics_list
    return olympics_dict_all
    #  abc_dict = {"a": 1}
    #  return abc_dict