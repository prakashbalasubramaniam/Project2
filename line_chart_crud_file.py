# import pandas and read csv file 
import pandas as pd

def line_chart_crud():
    df_athlete = pd.read_csv("../Project2/data/athlete_events.csv")

    # Remove 0 Medals
    df_athlete[['Medal']] = df_athlete[['Medal']].fillna(value=0)
    df_athlete_medal = df_athlete[df_athlete.Medal != 0]

    # Create new dictionary to hold all data to upload to MongoDB
    line_dict = {}

    # Filter Male Summer Medal
    df_athlete_medal_grpby_male_summer = df_athlete_medal[(df_athlete_medal.Season == 'Summer')]
    df_athlete_medal_grpby_male_summer = df_athlete_medal_grpby_male_summer[(df_athlete_medal_grpby_male_summer.Sex == 'M')]
    df_athlete_medal_grpby_male_summer = pd.DataFrame(df_athlete_medal_grpby_male_summer.groupby(['Year', 'Sex', 'Season'])['Medal'].count())
    df_athlete_medal_grpby_male_summer.reset_index(inplace = True)
    df_athlete_medal_grpby_male_summer= df_athlete_medal_grpby_male_summer.astype(str)
    year_list = []
    medal_list = []

    for i in range(len(df_athlete_medal_grpby_male_summer)):
        year_list.append(df_athlete_medal_grpby_male_summer['Year'][i])
        medal_list.append(df_athlete_medal_grpby_male_summer['Medal'][i])

    line_dict["summer_male_year"] = year_list
    line_dict["summer_male_medal"] = medal_list 

    # Filter Female Summer Medal
    df_athlete_medal_grpby_female_summer = df_athlete_medal[(df_athlete_medal.Season == 'Summer')]
    df_athlete_medal_grpby_female_summer = df_athlete_medal_grpby_female_summer[(df_athlete_medal_grpby_female_summer.Sex == 'F')]
    df_athlete_medal_grpby_female_summer = pd.DataFrame(df_athlete_medal_grpby_female_summer.groupby(['Year', 'Sex', 'Season'])['Medal'].count())
    df_athlete_medal_grpby_female_summer.reset_index(inplace = True)
    df_athlete_medal_grpby_female_summer= df_athlete_medal_grpby_female_summer.astype(str)
    year_list = []
    medal_list = []

    for i in range(len(df_athlete_medal_grpby_female_summer)):
        year_list.append(df_athlete_medal_grpby_female_summer['Year'][i])
        medal_list.append(df_athlete_medal_grpby_female_summer['Medal'][i])

    line_dict["summer_female_year"] = year_list
    line_dict["summer_female_medal"] = medal_list 

    # Filter Male Winter Medal
    df_athlete_medal_grpby_male_winter = df_athlete_medal[(df_athlete_medal.Season == 'Winter')]
    df_athlete_medal_grpby_male_winter = df_athlete_medal_grpby_male_winter[(df_athlete_medal_grpby_male_winter.Sex == 'M')]
    df_athlete_medal_grpby_male_winter = pd.DataFrame(df_athlete_medal_grpby_male_winter.groupby(['Year', 'Sex', 'Season'])['Medal'].count())
    df_athlete_medal_grpby_male_winter.reset_index(inplace = True)
    df_athlete_medal_grpby_male_winter = df_athlete_medal_grpby_male_winter.astype(str)
    year_list = []
    medal_list = []

    for i in range(len(df_athlete_medal_grpby_male_winter)):
        year_list.append(df_athlete_medal_grpby_male_winter['Year'][i])
        medal_list.append(df_athlete_medal_grpby_male_winter['Medal'][i])

    line_dict["winter_male_year"] = year_list
    line_dict["winter_male_medal"] = medal_list

    # Filter Female Winter Medal
    df_athlete_medal_grpby_female_winter = df_athlete_medal[(df_athlete_medal.Season == 'Winter')]
    df_athlete_medal_grpby_female_winter = df_athlete_medal_grpby_female_winter[(df_athlete_medal_grpby_female_winter.Sex == 'F')]
    df_athlete_medal_grpby_female_winter = pd.DataFrame(df_athlete_medal_grpby_female_winter.groupby(['Year', 'Sex', 'Season'])['Medal'].count())
    df_athlete_medal_grpby_female_winter.reset_index(inplace = True)
    df_athlete_medal_grpby_female_winter = df_athlete_medal_grpby_female_winter.astype(str)
    year_list = []
    medal_list = []

    for i in range(len(df_athlete_medal_grpby_female_winter)):
        year_list.append(df_athlete_medal_grpby_female_winter['Year'][i])
        medal_list.append(df_athlete_medal_grpby_female_winter['Medal'][i])

    line_dict["winter_female_year"] = year_list
    line_dict["winter_female_medal"] = medal_list

    return line_dict

