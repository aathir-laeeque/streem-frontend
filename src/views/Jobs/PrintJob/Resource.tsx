import checkmark from '#assets/images/checkmark.png';
import { Activity } from '#JobComposer/checklist.types';
import { baseUrl } from '#utils/apiUrls';
import { request } from '#utils/request';
import { Image, Text, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { styles } from './ActivityList';

const MemoResourceActivity = ({ activity }: { activity: Activity }) => {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    getOptions();
  }, []);

  const getOptions = async () => {
    const response: { data: any[]; errors: { message: string }[] } = await request(
      'GET',
      `${baseUrl}${activity.data.urlPath}`,
    );
    if (response.data) {
      setOptions(response.data);
    }
  };

  const selectedOption = activity.response?.choices?.length
    ? activity.response.choices.map((choice) => choice.objectDisplayName).join(', ')
    : undefined;

  return (
    <View style={styles.activityView}>
      <View
        style={[
          styles.materialActivityItems,
          {
            justifyContent: 'flex-start',
            borderBottomWidth: 0,
            paddingTop: 2,
          },
        ]}
        wrap={false}
      >
        <Text style={styles.activityHintText}>{activity.label}</Text>
      </View>
      {selectedOption ? (
        <Text style={styles.text12}>{selectedOption}</Text>
      ) : (
        <Text style={styles.text12}>______________________________________</Text>
      )}
    </View>
  );
};

const ResourceActivity = React.memo(MemoResourceActivity);

export default ResourceActivity;
