import {
  IonButton,
  IonCol,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonGrid,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonPage,
  IonRow,
  IonSearchbar,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import ExploreContainer from "../components/ExploreContainer";
import * as dvb from "dvbjs";
import "./Tab1.css";
import { useEffect, useState } from "react";
import moment from "moment";
import { list } from "ionicons/icons";

const Tab1: React.FC = () => {
  const [timeOffset, setTimeOffset] = useState(5);

  const [stops, setStops] = useState([{ name: "", id: "" }]);
  const [arrivals, setArrivals] = useState([
    { line: "", direction: "", time: "" },
  ]);
  const [stopId, setStopId] = useState("");
  const [selectedTime, setSelectedTime] = useState(new Date().toString());
  const numResults = 12;

  if (stops.length == 1) {
    document.getElementById("searchResult")?.classList.add("hide");
    document.getElementById("searchResult")?.classList.remove("show");
  } else {
    document.getElementById("searchResult")?.classList.remove("hide");
    document.getElementById("searchResult")?.classList.add("show");
  }

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
  document.getElementById("searchResult")?.classList.add("hide");  // move to useEffect

  useEffect(() => {
    let offset = moment(new Date(selectedTime)).diff(new Date(), "minutes");
    dvb.monitor(stopId, offset, numResults).then((data) => {
      setArrivals(
        data.map((m) => {
          let time = moment(m.arrivalTime.toString()).format("HH:mm");
          let diff = moment(m.arrivalTime).diff(new Date(), "minutes");
          if (diff === 0) {
            time = "jetzt";
          } else if (diff <= 5) {
            time = diff.toString() + " minuten";
          }
          return { line: m.line, direction: m.direction, time: time };
        })
      );
    });
  }, [stopId, selectedTime]);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Aktuelle Abfahrten</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonGrid>

          <IonRow>
            <IonCol size="12">
              <IonSearchbar
                onIonChange={(ev) => handleChange(ev)}
              ></IonSearchbar>
            </IonCol>
            <IonCol size="11" id="searchResult">
              <IonList>
                {stops.map((stop, index) => {
                  return (
                    <IonItem
                      key={index}
                      onClick={() => {
                        setStopId(stop.id);
                        setStops([]);
                      }}
                    >
                      <IonLabel>{stop.name}</IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonCol>
          </IonRow>

          
          <IonRow>
            <IonCol size="11">
              <IonDatetimeButton
                datetime="datetime"
                className="timeButton"
              ></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="datetime"
                  onIonChange={(ev) => {
                    setSelectedTime(ev.detail.value?.toLocaleString() || "");
                  }}
                ></IonDatetime>
              </IonModal>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="11">
              <IonList>
                {arrivals.map((ar, i) => {
                  return (
                    <IonItem key={i}>
                      <IonLabel className="color-dvb">{ar.line}</IonLabel>
                      <IonLabel>{ar.direction}</IonLabel>
                      <IonLabel>{ar.time}</IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
