import { MongoClient, ObjectId } from 'mongodb';
import Head from 'next/head';
import MeetupDetail from '../../components/meetups/MeetupDetail';

function MeetupDetails(props) {
	const { id, image, title, address, description } = props.meetupData;

	return (
		<>
			<Head>
				<title>{`Meetup Detail of ${title} [${id}]`}</title>
				<meta name='description' content={description} />
			</Head>
			<MeetupDetail
				image={image}
				title={title}
				address={address}
				description={description}
			/>
		</>
	);
}

export async function getStaticPaths() {
	const client = await MongoClient.connect(
		'mongodb://tungas:yFkvhvH4J0ws5zRQ3HulZsiPWvu1gjQ9siDgi7Q4haVGivnQ6Ld1UXP3rcIjUMTb0tWvswc8KsPLP1BdaaHWAQ==@tungas.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@tungas@'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray();

	client.close();

	return {
		fallback: false,
		paths: meetups.map((meetup) => ({
			params: { meetupId: meetup._id.toString() },
		})),
	};
}

export async function getStaticProps(context) {
	const meetupId = context.params.meetupId;

	const client = await MongoClient.connect(
		'mongodb://tungas:yFkvhvH4J0ws5zRQ3HulZsiPWvu1gjQ9siDgi7Q4haVGivnQ6Ld1UXP3rcIjUMTb0tWvswc8KsPLP1BdaaHWAQ==@tungas.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&replicaSet=globaldb&maxIdleTimeMS=120000&appName=@tungas@'
	);
	const db = client.db();

	const meetupsCollection = db.collection('meetups');

	const selectedMeetup = await meetupsCollection.findOne({
		_id: ObjectId(meetupId),
	});

	client.close();

	return {
		props: {
			meetupData: {
				id: selectedMeetup._id.toString(),
				title: selectedMeetup.title,
				address: selectedMeetup.address,
				image: selectedMeetup.image,
				description: selectedMeetup.description,
			},
		},
	};
}

export default MeetupDetails;
