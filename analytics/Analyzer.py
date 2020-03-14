import pandas as pd
import numpy as np
import emoji
from collections import Counter

class Analyzer:
    def __init__(self, data, chat_name=None):
        self.data = data
        self.chat_name = chat_name

    def make_message_df(self):
        # === SETUP ===

        # Create dataframe from csv file
        df = pd.DataFrame(self.data, columns=['Date', 'Time', 'Author', 'Message'])

        if self.chat_name:
            df = df[df['Author'] != self.chat_name]
            
        # Create Message Dataframe without Media and No-Author Rows
        null_authors_df = df[df['Author'].isnull()]

        video_messages = df[df['Message'] == 'Video weggelassen']
        photo_messages = df[df['Message'] == 'Bild weggelassen']
        audio_messages = df[df['Message'] == 'Audio weggelassen']

        messages_df = df.drop(null_authors_df.index) # Drops all rows of the data frame containing messages from null authors
        messages_df = messages_df.drop(video_messages.index) # Drops all rows of the data frame containing media messages
        messages_df = messages_df.drop(photo_messages.index)
        messages_df = messages_df.drop(audio_messages.index)

        # Add more specific time information
        messages_df['Date'] = pd.to_datetime(df['Date'])

        messages_df['Year'] = messages_df['Date'].apply(lambda x: x.year)
        messages_df['Month'] = messages_df['Date'].apply(lambda x: x.month)
        messages_df['Day'] = messages_df['Date'].apply(lambda x: x.dayofweek)
        messages_df['Hour'] = messages_df['Time'].apply(lambda x : x.split(':')[0]) # The first token of a value in the Time Column contains the hour (Eg., "20" in "20:15")

        # messages_df['Day'] = messages_df['Day'].map({0:'Mon',1:'Tue',2:'Wed',3:'Thu',4:'Fri',5:'Sat',6:'Sun'})

        # Add Columns for Word and letter count
        messages_df['Word_Count'] = messages_df['Message'].apply(lambda s : len(s.split(' ')))
        messages_df['Letter_Count'] = messages_df['Message'].apply(lambda s : len(s))

        return messages_df
    
    def analyze(self):
        # # === SETUP ===

        # Create dataframe from csv file
        df = pd.DataFrame(self.data, columns=['Date', 'Time', 'Author', 'Message'])
        messages_df = self.make_message_df()

        # # Empty output dictionary
        output = {}

        # === Analytics ===

        # Total messages
        total_msg = len(df)
        output['Total_Messages'] = total_msg

        # Messages per author
        author_value_counts = df['Author'].value_counts()
        output['Author_Value_Counts'] = author_value_counts.to_dict()

        # Top 10 Authors
        top_10_authors = df['Author'].value_counts().head(20)
        output['Top_10_Authors'] = top_10_authors.to_dict()

        # Total Word & Letter Count
        total_letter_count = messages_df['Letter_Count'].sum()
        total_word_count = messages_df['Word_Count'].sum()

        output['Total_Letter_Count'] = total_letter_count
        output['Total_Word_Count'] = total_word_count

        # Average words per message
        avg_words_per_msg = round(messages_df['Word_Count'].mean(),2)
        output['Average_Words_Per_Message'] = avg_words_per_msg

        # Total Words by Author
        total_word_count_grouped_by_author = messages_df[['Author', 'Word_Count']].groupby('Author').sum()
        sorted_total_word_count_grouped_by_author = total_word_count_grouped_by_author.sort_values('Word_Count', ascending=False)
        output['Total_Word_Count_By_Author'] = sorted_total_word_count_grouped_by_author.to_dict()

        # Top 10 days by number of messages
        output['Top_10_Days_By_Messages'] = df['Date'].value_counts().head(10).to_dict()

        # Worst 10 days by number of messages
        output['Worst_10_Days_By_Messages'] = df['Date'].value_counts().tail(10).to_dict()

        # Average Number of messages per day
        average_messages_per_day = df['Date'].value_counts().mean()
        output['Average_Messages_Per_Day'] = round(average_messages_per_day)

        # Top 10 Most common messages
        most_common_msg = messages_df['Message'].value_counts().head(10)
        output['Most_Common_Messages'] = messages_df['Message'].value_counts().head(10).to_dict()

        # Number of messages for each year
        msg_per_year = messages_df['Year'].value_counts()
        output['Messages_Per_Year'] = msg_per_year.to_dict()

        # Message count by hour and weekday
        hourDay = messages_df.groupby(['Day', 'Hour']).count()['Author'].unstack()
        output['Messages_By_Day_Hour'] = hourDay.to_dict()

        # Message count by month and year
        monthYear = messages_df.groupby(['Year', 'Month']).count()['Author'].unstack()
        output['Most_Active_Months'] = monthYear.to_dict()

        # Most active weekday
        most_active_weekday = messages_df['Day'].value_counts()
        output['Most_Active_Weekday'] = most_active_weekday.to_dict()

        # Most active month
        most_active_month = messages_df['Month'].value_counts()
        output['Most_Active_Month'] = most_active_month.to_dict()

        # Most active hour
        most_active_hour = messages_df['Hour'].value_counts().sort_index(ascending=True)
        output['Most_Active_Hour'] = most_active_hour.to_dict()

        # Start & End Date of converstaion data
        start_date = df.iloc[0]['Date']
        end_date = df.iloc[-1]['Date']
        output['Start_Date'] = start_date
        output['End_Date'] = end_date

        # Emojis
        all_emojis = []
        for message in messages_df['Message']:
            for char in message:
                if char in emoji.UNICODE_EMOJI:
                    all_emojis.append(char)
        emoji_count = Counter(all_emojis)
        emoji_dict = dict(emoji_count)
        output['Most_Common_Emojis'] = sorted(emoji_dict.items(), key=lambda item: item[1], reverse=True)

        return output

    #### YEARLY SPLIT ####

    def year_analysis(self):
        messages_df = self.make_message_df()

        years = messages_df['Year'].unique() # get unique years
        year_split = []
        
        # list entry for each years df
        for year in years:
            year_split.append(messages_df[messages_df['Year'] == year])
        
        year_data = []

        for year in year_split:
            anno = year['Year'].iloc[0] # get year
            total_msg_year = len(year)
            avg_daily_year = round(year['Date'].value_counts().mean(),2)
            total_words_year = year['Word_Count'].sum()
            avg_words_year = round(year['Word_Count'].mean(),2)
            hours_year = year['Hour'].value_counts().sort_index(ascending=True)
            top_authors_year = year['Author'].value_counts().head(5)
            top_messages_year = year['Message'].value_counts().head(5)

            y = {
                'year': anno,
                'Total_Messages': total_msg_year,
                'Average_Messages_Per_Day': avg_daily_year,
                'Total_Words': total_words_year,
                'Average_Words_Per_Message': avg_words_year,
                'Most_Active_Times': hours_year.to_dict(),
                'Top_Authors': top_authors_year.to_dict(),
                'Top_Messages': top_messages_year.to_dict()
            }

            year_data.append(y)
        
        return year_data

        

    
