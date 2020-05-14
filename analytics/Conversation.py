import os
import re
import csv

from django.conf import settings

# path for the cleaned chat
if setting.DEBUG:
    clean_chat_path = os.path.join(settings.BASE_DIR, 'media/clean')
else:
    clean_chat_path = '/media/clean'
# path for the csv version
csv_path = os.path.join(settings.BASE_DIR, 'media/csv')

class Conversation:

    def __init__(self, filename):
        self.filename = filename
        self.raw_chat_path = os.path.join(settings.BASE_DIR, f'media/raw/{self.filename}')
        # if this file has not been cleaned yet, clean it
        if not os.path.isfile(clean_chat_path + f'/{filename}'):
            with open(self.raw_chat_path) as file:
                while True:
                    line = file.readline()
                    # stop loop if there are no more lines
                    if not line:
                        break
                    # all of this logic is based on the format of the .txt file which we get from whatsapp
                    if line[0] == '\u200e':
                        with open(clean_chat_path + f'/clean_{filename}', 'a') as new:
                            clean = line[2:17] + ' - ' + line[22:]
                            new.write(clean.replace('\u200e', ''))
                    elif line[0] == '[':
                        with open(clean_chat_path + f'/clean_{filename}', 'a') as new:
                            clean = line[1:16] + ' - ' + line[21:]
                            new.write(clean)
                    else:
                        with open(clean_chat_path + f'/clean_{filename}', 'a') as new:
                            new.write(line)
        # data is now formatted like this: 
        # dd.mm.yy, hh:mm - [author]: [message]
        self.clean_chat_path = clean_chat_path + f'/clean_{filename}'
    
    # return true if string starts with timestamp
    def starts_with_date(self, s):
        pattern = '^([0-2][0-9]|(3)[0-1])(\.)(((0)[0-9])|((1)[0-2]))(\.)(\d{2}|\d{4}), ([0-9][0-9]):([0-9][0-9]) - '
        result = re.match(pattern, s)
        if result:
            return True
        return False
    
    # return true if string starts with author
    def starts_with_author(self, s):
        s = s.encode('ascii', 'ignore').decode('utf-8') # remove emojis for pattern check
        patterns = [
            '([\w]+):',                        # First Name
            '([\w]+[\s]+[\w]+):',              # First Name + Last Name
            '([\w]+[\s]+[\w]+[\s]+[\w]+):',    # First Name + Middle Name + Last Name
            '([+]\d{2} \d{5} \d{5}):',         # Mobile Number (India)
            '([+]\d{2} \d{3} \d{7,8}):',       # Mobile Number (Austria)
            '([+]\d{2} \d{3} \d{3} \d{4}):'    # Mobile Number (US)
        ]
        pattern = '^' + '|'.join(patterns)
        result = re.match(pattern, s)
        if result:
            return True
        return False
    
    # categorize parts of the line
    def get_data_point(self, line):
        split_line = line.split(' - ') # separate timestamp from rest
        
        date_time = split_line[0] # timestamp variable
        
        date, time = date_time.split(', ') # separate date from time and store each in variable
        
        message = ' '.join(split_line[1:]) # message variable    
        
        if self.starts_with_author(message):
            split_message = message.split(': ') # separate author from message
            author = split_message[0] # author variable
            message = ' '.join(split_message[1:]) # message variable
            
        elif message[0] == '\u202a':
            split_message = message.split(': ')
            author_with_unicode = split_message[0] # author variable that still includes unicode characters
            message = ' '.join(split_message[1:]) # there might be additional ': ' in the message so join

            author = author_with_unicode.encode('ascii', 'ignore').decode('utf-8') # author without unicode characters
        else:
            author = None
                
        return date, time, author, message
    
    # read lines into csv file
    def parse_data(self):
        parsed_data = [] # List to keep track of data so it can be used by a Pandas dataframe

        with open(self.clean_chat_path, encoding='utf-8') as file:
            # file.readline() # Skipping first line of the file (usually contains information about end-to-end encryption)
                
            message_buffer = [] # Buffer to capture intermediate output for multi-line messages
            date, time, author = None, None, None # Intermediate variables to keep track of the current message being processed
            
            while True:
                line = file.readline() 
                
                if not line: # Stop reading further if end of file has been reached
                    break
                    
                line = line.strip() # Guarding against erroneous leading and trailing whitespaces
                
                if self.starts_with_date(line): # If a line starts with a Date Time pattern, then this indicates the beginning of a new message
                    
                    if len(message_buffer) > 0: # Check if the message buffer contains characters from previous iterations
                        parsed_data.append([date, time, author, ' '.join(message_buffer)]) # Save the tokens from the previous message in parsedData
                    
                    message_buffer.clear() # Clear the message buffer so that it can be used for the next message
                    date, time, author, message = self.get_data_point(line) # Identify and extract tokens from the line
                    message_buffer.append(message) # Append message to buffer
                
                else:
                    message_buffer.append(line) # If a line doesn't start with a Date Time pattern, then it is part of a multi-line message. So, just append to buffer

        self.csv_path = csv_path + f'/{self.filename[:-4]}.csv'
        with open(csv_path + f'/{self.filename[:-4]}.csv', 'w') as f:
            writer = csv.writer(f)
            writer.writerow(['date', 'time', 'author', 'message'])
            writer.writerows(parsed_data)
        
        return parsed_data

    def delete_files(self):
        os.remove(self.raw_chat_path)
        os.remove(self.clean_chat_path)
        os.remove(self.csv_path)
