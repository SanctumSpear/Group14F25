import ScoreRing from '@/components/ui/score-ring';
import StatCard from '@/components/ui/stat-card';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { getSupabase } from '@/supabase/supabaseClient';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { FlatList } from 'react-native-gesture-handler';


interface TripScoreDetails {
  tripscore_value: number | null;
  trip_duration: string | null;
  trip_rapidAccel: number | null;
  trip_rapidDecel: number | null;
  tripinsight_description: string | null;
  tripinsight_recommendation: string | null;
  error?: string;
}

interface TripSummary {
  trip_id: string; // UUID string
  date: string;
  score: number;
  summary: string;
}

export default function TripScoreScreen(){
  const [userId, setUserId] = useState<string | null>(null);
  const [safetyEvents, setSafetyEvents] = useState<number | null>(null);
  const [details, setDetails] = useState<TripScoreDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [summaries, setSummaries] = useState<TripSummary[]>([]);
  const [summariesLoading, setSummariesLoading] = useState(true);
  const colorScheme = useColorScheme();
  const theme = Colors[colorScheme ?? 'light'];
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);
  const [dropdownItems, setDropdownItems] = useState(
    summaries.map(trip => ({
      label: `${trip.date} (Score: ${trip.score})`,
      value: trip.trip_id,
    }))
  );

  useEffect(() => {
  const fetchUser = async () => {
    const supabase = getSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Use user.id as the user_id for your fetch
      setUserId(user.id);
    }
  };
  fetchUser();
}, []);

  // When summaries are loaded, set the default selected trip
// Keep dropdownItems in sync with summaries
useEffect(() => {
  setDropdownItems(
    summaries.map(trip => ({
      label: `${trip.date} (Score: ${trip.score})`,
      value: trip.trip_id,
    }))
  );
}, [summaries]);

  // Fetch the trip score details using the edge function
  useEffect(() => {
  if (!userId) return;
  setLoading(true);

  // Build the URL: if selectedTripId is null, omit trip_id
  let url = `https://dagsbgwwdhosdgppojks.functions.supabase.co/fetch-trip-score-details?user_id=${userId}`;
  if (selectedTripId) {
    url += `&trip_id=${selectedTripId}`;
  }
  // Log the user_id and trip_id being used
  console.log('TripScore fetch:', { userId, selectedTripId, url });
  fetch(url)
    .then(res => res.json())
    .then(data => setDetails(data))
    .catch((err) => 
    {
      setDetails({ 
      tripscore_value: null, 
      trip_duration: null, 
      trip_rapidAccel: null, 
      trip_rapidDecel: null, 
      tripinsight_description: null, 
      tripinsight_recommendation: null, 
      error: 'Failed to fetch trip data.' 
    })
      
    })
    .finally(() =>{ 
      setLoading(false); });
}, [selectedTripId, userId]);

useEffect(() => {
  if (details) {
    setSafetyEvents((details.trip_rapidAccel ?? 0) + (details.trip_rapidDecel ?? 0));
  }
}, [details]);

  // Fetch a series of previous trip summaries
  useEffect(() => {
    if(!userId) return;
    setSummariesLoading(true);
    fetch(`https://dagsbgwwdhosdgppojks.functions.supabase.co/fetch-trip-score-summaries?limit=5&user_id=${userId}`)
      .then(res => res.json())
      .then(data => {
        setSummaries(Array.isArray(data) ? data : []);
      }) 
      .catch((err) => {
        setSummaries([]);
      })
      .finally(() => setSummariesLoading(false));
  }, [userId]);

  useEffect(() => {
  if (summaries.length > 0 && selectedTripId === null) {
    setSelectedTripId(summaries[0].trip_id);
  }
}, [summaries, selectedTripId]);



  if (loading) return <Text>Loading...</Text>;
  if (!details || details.error) {
    return (
      <View style={styles.container}>
        <Text style={{ color: 'red', textAlign: 'center', marginTop: 40 }}>
          {details?.error ?? 'No trip data found.'}
        </Text>
      </View>
    );
  }  


  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: theme.text, textAlign: 'center' }] }>Trip Score</Text>
      {/* Picker section with card styling */}
      <DropDownPicker
        open={open}
        value={selectedTripId}
        items={dropdownItems}
        setOpen={setOpen}
        setValue={setSelectedTripId}
        setItems={setDropdownItems}
        style={{
          backgroundColor: theme.background,
          borderColor: theme.tint,
          zIndex: 1000,
        }}
        textStyle={{
          color: theme.text,
          fontSize: 16,
        }}
        dropDownContainerStyle={{
          backgroundColor: theme.background,
          borderColor: theme.tint,
          zIndex: 1001,
        }}
        listItemLabelStyle={{
          color: theme.text,
        }}
        placeholder="Select a trip"
        zIndex={1000}
        zIndexInverse={3000}
      />
      {/* Trip Score ScoreRing Section */}
      <Text> {'\n'}  </Text>
      <ScoreRing score={details.tripscore_value ?? 0} />
      <View style={styles.statsRow}>
        <StatCard label="Safety Events" value={safetyEvents !== null ? safetyEvents.toString() : 'N/A'} />
        <StatCard label="Duration" value={details.trip_duration ?? 'N/A'} />
      </View>
      <View style={styles.trends}>
        <Text style={{ color: theme.text }}>
          {details.tripinsight_description ?? 'No insight available.'}
        </Text>
        <Text style={{ color: theme.text }}>
          {details.tripinsight_recommendation ?? ''}
        </Text>
      </View>
      {/* Previous Scores Section - flex: 1 to push to bottom */}
      <View style={{ flex: 1, minHeight: 0 }}>
        <Text style={[styles.recentTripsTitle, { color: theme.text }]}>Previous Scores</Text>
          <FlatList
            data={summaries}
            keyExtractor={item => item.trip_id}
            style={[styles.recentTripsList, styles.flatListBorder, { flex: 1, marginBottom: 0, paddingBottom: 0 }]}
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 0 }}
            ListEmptyComponent={
              summariesLoading ? (
                <Text style={{ color: theme.text }}>Loading...</Text>
              ) : (
                <Text style={{ color: theme.text }}>No recent trips found.</Text>
              )
            }
            renderItem={({ item }) => (
              <View style={[styles.tripCard, { backgroundColor: theme.background, borderWidth: 1, borderColor: theme.tint }]}>
                <Text style={[styles.tripDate, { color: theme.text }]}>{item.date}</Text>
                <Text style={[styles.tripScore, { color: theme.tint }]}>{item.score}</Text>
                <Text style={[styles.tripSummary, { color: theme.text }]}>{item.summary}</Text>
              </View>
            )}
          />
      </View>
    </View>
  );
}



const styles = StyleSheet.create({
    flatListBorder: {
      borderWidth: 2,
      borderColor: '#888', // You can use theme.tint or any color you like
      borderRadius: 10,
    },
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 0 },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20 },
  trends: { marginVertical: 20 },
  recentTripsTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10, textAlign: 'center' },
  recentTripsList: { marginBottom: 0 },
  tripCard: {
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 8, // Add horizontal margin to shrink cards inside the border
  },
  pickerContainer: {
  borderRadius: 10,
  borderWidth: 1,
  marginBottom: 16,
  paddingHorizontal: 8,
  paddingVertical: 2,
  // Optionally add shadow for iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  // Optionally add elevation for Android
  elevation: 2,
},
  tripDate: { fontSize: 13, marginBottom: 2 },
  tripScore: { fontWeight: 'bold', fontSize: 15 },
  tripSummary: { fontSize: 13 },
});