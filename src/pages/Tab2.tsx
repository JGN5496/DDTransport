import {
  IonAccordion,
  IonAccordionGroup,
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
import "./Tab2.css";

import * as dvb from "dvbjs";
import INode from "dvbjs";
import { useEffect, useState } from "react";
import moment, { duration } from "moment";

const Tab2: React.FC = () => {
  const [starts, setStarts] = useState([{ name: "", id: "" }]);
  const [startId, setStartId] = useState("");

  const [destinations, setDestinations] = useState([{ name: "", id: "" }]);
  const [destinationId, setDestinationId] = useState("");

  const [connections, setConnections] = useState([
    {
      nodes: [{}],
      interchanges: 0,
      duration: 0,
      arrivalTime: "",
      departureTime: "",
      lines: [""],
      directions: [""],
      departureName: [""],
      departureStopTime: [""],
      departurePlatform: [""],
      arrivalName: [""],
      arrivalStopTime: [""],
      arrivalPlatform: [""],
      mode: [""],
    },
  ]);
  const [selectedTime, setSelectedTime] = useState(new Date().toString()); //was with .toString

  const handleStartChange = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();
    dvb.findStop(query).then((data) => {
      setStarts(
        data.map((m) => {
          return { name: m.name, id: m.id };
        })
      );
    });
  };

  const handleDestinationChange = (ev: Event) => {
    let query = "";
    const target = ev.target as HTMLIonSearchbarElement;
    if (target) query = target.value!.toLowerCase();
    dvb.findStop(query).then((data) => {
      setDestinations(
        data.map((m) => {
          return { name: m.name, id: m.id };
        })
      );
    });
  };

  useEffect(() => {
    let offset = moment(new Date(selectedTime)).diff(new Date(), "minutes");
    let selTime = new Date();
    console.log(startId);
    console.log(new Date(selectedTime));
    dvb
      .route(startId, destinationId, new Date(selectedTime), false)
      .then((data) => {
        let temp = data.trips.map((m) => {
          return {
            nodes: m.nodes,
            interchanges: m.interchanges,
            duration: m.duration,
            arrivalTime:
              moment(m.arrival?.time.toString()).format("HH:mm") || "",
            departureTime:
              moment(m.departure?.time.toString()).format("HH:mm") || "",
            lines: m.nodes.map((f) => f.line),
            directions: m.nodes.map((f) => f.direction),
            departureName: m.nodes.map((f) => f.departure?.name || ""),
            departurePlatform: m.nodes.map(
              (f) => f.departure?.platform?.name || ""
            ),
            departureStopTime: m.nodes.map(
              (f) => moment(f.departure?.time.toString()).format("HH:mm") || ""
            ),
            arrivalName: m.nodes.map((f) => f.arrival?.name || ""),
            arrivalPlatform: m.nodes.map(
              (f) => f.arrival?.platform?.name || ""
            ),
            arrivalStopTime: m.nodes.map(
              (f) => moment(f.arrival?.time.toString()).format("HH:mm") || ""
            ),
            mode: m.nodes.map((f) => f.mode?.name || ""),
          };
        });
        setConnections(temp);
        console.log(connections);
      });
  }, [startId, destinationId, selectedTime]);

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
                placeholder="Starthaltestelle"
                onIonChange={(ev) => handleStartChange(ev)}
              ></IonSearchbar>
            </IonCol>
            <IonCol size="12" id="searchResultStart">
              <IonList>
                {starts.map((start, index) => {
                  return (
                    <IonItem
                      key={index}
                      onClick={() => {
                        setStartId(start.id);
                        setStarts([]);
                      }}
                    >
                      <IonLabel>{start.name}</IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
              <IonSearchbar
                placeholder="Zielhaltestelle"
                onIonChange={(ev) => handleDestinationChange(ev)}
              ></IonSearchbar>
            </IonCol>
            <IonCol size="12" id="searchResultDestination">
              <IonList>
                {destinations.map((destination, index) => {
                  return (
                    <IonItem
                      key={index}
                      onClick={() => {
                        setDestinationId(destination.id);
                        setDestinations([]);
                      }}
                    >
                      <IonLabel>{destination.name}</IonLabel>
                    </IonItem>
                  );
                })}
              </IonList>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="12">
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
          {/* <IonRow>
            <IonCol size="12">
              <IonAccordionGroup>
                {connections.map((ar, i) => {
                  return (
                    <IonAccordion value="test">
                      <IonItem key={i}>
                        <IonLabel className="color-dvb"></IonLabel>
                        <IonLabel>Umstiege: {ar.interchanges}</IonLabel>
                        <IonLabel>Dauer: {ar.duration}</IonLabel>
                        <IonLabel>Dauer: {ar.arrivalTime}</IonLabel>
                        <IonLabel>Dauer: {ar.departureTime}</IonLabel>
                      </IonItem>
                    </IonAccordion>
                  );
                })}
              </IonAccordionGroup>
            </IonCol>
          </IonRow> */}
          <IonRow>
            <IonCol size="12">
              {connections.map((ar, i) => {
                return (
                  <IonAccordionGroup>
                    <IonAccordion value="test">
                      <IonItem key={i} slot="header" color="light">
                        <IonLabel className="color-dvb"></IonLabel>
                        <IonLabel>Ab: {ar.departureTime}</IonLabel>
                        <IonLabel>An: {ar.arrivalTime}</IonLabel>
                        <IonLabel>Dauer: {ar.duration}</IonLabel>
                        <IonLabel>Umstiege: {ar.interchanges}</IonLabel>
                      </IonItem>
                      <div className="ion-padding" slot="content">
                        <IonList>
                          {ar.lines.map((li, i) => {
                            return (
                              <IonItem key={i}>
                                <IonRow>
                                  <IonCol size="3">
                                    <IonLabel className="color-dvb">
                                      {li}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Richtung: {ar.directions[i]}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Abfahrt: {ar.departureName[i]}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Steig: {ar.departurePlatform[i]}
                                    </IonLabel>
                                  </IonCol>
                                  </IonRow>
                                  <IonRow>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Ab: {ar.departureStopTime[i]}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Ankunft: {ar.arrivalName[i]}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      Steig: {ar.arrivalPlatform[i]}
                                    </IonLabel>
                                  </IonCol>
                                  <IonCol size="3">
                                    <IonLabel>
                                      An: {ar.arrivalStopTime[i]}
                                    </IonLabel>
                                  </IonCol>
                                </IonRow>
                              </IonItem>
                            );
                          })}
                        </IonList>
                      </div>
                    </IonAccordion>
                  </IonAccordionGroup>
                );
              })}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
