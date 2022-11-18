import { IonButton, IonContent, IonHeader, IonItem, IonLabel, IonList, IonPage, IonSearchbar, IonTitle, IonToolbar } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Tab2.css';


import * as dvb from "dvbjs"
import { useEffect, useState } from 'react';




const Tab2: React.FC = () => {


  const [stops, setStops] = useState([{ name: "", id: "" }]);


  const handleChange = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();
    dvb.findStop(query).then((data) => {
      setStops(
        data.map((m) => {
          return { name: m.name, id: m.id };
        })
      );
    });
  };

  const [arrivals, setArrivals] = useState([
    { line: "", direction: "", time: "" },
  ]);
  const [stopId, setStopId] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date().toString());
  const numResults = 12;


  

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Stop List API Fetch</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonSearchbar></IonSearchbar>
        <IonList>
          {/* { dataArray.map((item:any) => (
            <IonItem>
              <IonLabel>Test</IonLabel>
            </IonItem>

          )) } */}
          {/* { data.map(()))} */}
            {/* {data} */}
            {/* <IonItem>
              <IonLabel>Test</IonLabel>
            </IonItem>
            <IonItem>
              <IonLabel>Test</IonLabel>
            </IonItem> */}
          </IonList>
          {/* <IonButton>Default</IonButton> */}
        <ExploreContainer name="Tab 2 page" />
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
