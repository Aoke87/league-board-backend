import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type MatchV5Document = MatchV5 & Document;

@Schema()
class ObjectiveDto {
  @Prop({ required: true }) first: boolean;
  @Prop({ required: true }) kills: number;
}

const ObjectiveDtoSchema = SchemaFactory.createForClass(ObjectiveDto);

@Schema()
class ObjectivesDto {
  @Prop({ required: true, type: ObjectiveDtoSchema }) baron: ObjectiveDto;
  @Prop({ required: true, type: ObjectiveDtoSchema }) champion: ObjectiveDto;
  @Prop({ required: true, type: ObjectiveDtoSchema }) dragon: ObjectiveDto;
  @Prop({ required: true, type: ObjectiveDtoSchema }) inhibitor: ObjectiveDto;
  @Prop({ required: true, type: ObjectiveDtoSchema }) riftHerald: ObjectiveDto;
  @Prop({ required: true, type: ObjectiveDtoSchema }) tower: ObjectiveDto;
}

const ObjectivesDtoSchema = SchemaFactory.createForClass(ObjectivesDto);

@Schema()
class PerkStyleSelectionDto {
  @Prop({ required: true }) perk: number;
  @Prop({ required: true }) var1: number;
  @Prop({ required: true }) var2: number;
  @Prop({ required: true }) var3: number;
}

const PerkStyleSelectionDtoSchema = SchemaFactory.createForClass(PerkStyleSelectionDto);

@Schema()
class BanDto {
  @Prop({ required: true }) championId: number;
  @Prop({ required: true }) pickTurn: number;
}

const BanDtoSchema = SchemaFactory.createForClass(BanDto);

@Schema()
class TeamDto {
  @Prop({ required: true, type: [BanDtoSchema] }) bans: BanDto[];
  @Prop({ required: true, type: ObjectivesDtoSchema }) objectives: ObjectivesDto;
  @Prop({ required: true }) teamId: number;
  @Prop({ required: true }) win: boolean;
}

const TeamDtoSchema = SchemaFactory.createForClass(TeamDto);


@Schema()
class MetadataDto extends Document {
  @Prop({ required: true }) dataVersion: string;
  @Prop({ required: true, unique: true }) matchId: string;
  @Prop({ required: true }) participants: string[];
}

const MetadataDtoSchema = SchemaFactory.createForClass(MetadataDto);

@Schema()
class PerkStatsDto {
  @Prop({ required: true }) defense: number;
  @Prop({ required: true }) flex: number;
  @Prop({ required: true }) offense: number;
}

const PerkStatsDtoSchema = SchemaFactory.createForClass(PerkStatsDto);

@Schema()
class PerkStyleDto {
  @Prop({ required: true }) description: Description;
  @Prop({ required: true, type: [PerkStyleSelectionDtoSchema] }) selections: PerkStyleSelectionDto[];
  @Prop({ required: true }) style: number;
}

const PerkStyleDtoSchema = SchemaFactory.createForClass(PerkStyleDto);

@Schema()
class PerksDto {
  @Prop({ required: true, type: PerkStatsDtoSchema }) statPerks: PerkStatsDto;
  @Prop({ required: true, type: [PerkStyleDtoSchema] }) styles: PerkStyleDto[];
}

const PerksDtoSchema = SchemaFactory.createForClass(PerksDto);

@Schema()
class ParticipantDto {
  @Prop({ required: true }) assists: number;
  @Prop({ required: true }) baronKills: number;
  @Prop({ required: true }) bountyLevel: number;
  @Prop({ required: true }) champExperience: number;
  @Prop({ required: true }) champLevel: number;
  @Prop({ required: true }) championId: number;
  @Prop({ required: true }) championName: string;
  /** This field is currently only utilized for Kayn's transformations. (Legal values: 0 - None, 1 - Slayer, 2 - Assassin) */
  @Prop({ required: true }) championTransform: number;
  @Prop({ required: true }) consumablesPurchased: number;
  @Prop({ required: false }) damageDealtToBuildings: number;
  @Prop({ required: true }) damageDealtToObjectives: number;
  @Prop({ required: true }) damageDealtToTurrets: number;
  @Prop({ required: true }) damageSelfMitigated: number;
  @Prop({ required: true }) deaths: number;
  @Prop({ required: true }) detectorWardsPlaced: number;
  @Prop({ required: true }) doubleKills: number;
  @Prop({ required: true }) dragonKills: number;
  @Prop({ required: true }) firstBloodAssist: boolean;
  @Prop({ required: true }) firstBloodKill: boolean;
  @Prop({ required: true }) firstTowerAssist: boolean;
  @Prop({ required: true }) firstTowerKill: boolean;
  @Prop({ required: true }) gameEndedInEarlySurrender: boolean;
  @Prop({ required: true }) gameEndedInSurrender: boolean;
  @Prop({ required: true }) goldEarned: number;
  @Prop({ required: true }) goldSpent: number;
  /** Both individualPosition and teamPosition are computed by the game server and are different versions of the most likely position played by a player. The individualPosition is the best guess for which position the player actually played in isolation of anything else. The teamPosition is the best guess for which position the player actually played if we add the constraint that each team must have one top player, one jungle, one middle, etc. Generally the recommendation is to use the teamPosition field over the individualPosition field. */
  @Prop({ required: true }) individualPosition: Position;
  @Prop({ required: true }) inhibitorKills: number;
  @Prop({ required: false }) inhibitorTakedowns: number;
  @Prop({ required: false }) inhibitorsLost: number;
  @Prop({ required: true }) item0: number;
  @Prop({ required: true }) item1: number;
  @Prop({ required: true }) item2: number;
  @Prop({ required: true }) item3: number;
  @Prop({ required: true }) item4: number;
  @Prop({ required: true }) item5: number;
  @Prop({ required: true }) item6: number;
  @Prop({ required: true }) itemsPurchased: number;
  @Prop({ required: true }) killingSprees: number;
  @Prop({ required: true }) kills: number;
  @Prop({ required: true }) lane: Lane;
  @Prop({ required: true }) largestCriticalStrike: number;
  @Prop({ required: true }) largestKillingSpree: number;
  @Prop({ required: true }) largestMultiKill: number;
  @Prop({ required: true }) longestTimeSpentLiving: number;
  @Prop({ required: true }) magicDamageDealt: number;
  @Prop({ required: true }) magicDamageDealtToChampions: number;
  @Prop({ required: true }) magicDamageTaken: number;
  @Prop({ required: true }) neutralMinionsKilled: number;
  @Prop({ required: true }) nexusKills: number;
  @Prop({ required: false }) nexusTakedowns: number;
  @Prop({ required: false }) nexusLost: number;
  @Prop({ required: true }) objectivesStolen: number;
  @Prop({ required: true }) objectivesStolenAssists: number;
  @Prop({ required: true }) participantId: number;
  @Prop({ required: true }) pentaKills: number;
  @Prop({ required: true, type: PerksDtoSchema }) perks: PerksDto;
  @Prop({ required: true }) physicalDamageDealt: number;
  @Prop({ required: true }) physicalDamageDealtToChampions: number;
  @Prop({ required: true }) physicalDamageTaken: number;
  @Prop({ required: true }) profileIcon: number;
  @Prop({ required: true }) puuid: string;
  @Prop({ required: true }) quadraKills: number;
  @Prop({ required: false }) riotIdName: string;
  @Prop({ required: false }) riotIdTagline: string;
  @Prop({ required: true }) role: Role;
  @Prop({ required: true }) sightWardsBoughtInGame: number;
  @Prop({ required: true }) spell1Casts: number;
  @Prop({ required: true }) spell2Casts: number;
  @Prop({ required: true }) spell3Casts: number;
  @Prop({ required: true }) spell4Casts: number;
  @Prop({ required: true }) summoner1Casts: number;
  @Prop({ required: true }) summoner1Id: number;
  @Prop({ required: true }) summoner2Casts: number;
  @Prop({ required: true }) summoner2Id: number;
  @Prop({ required: true }) summonerId: string;
  @Prop({ required: true }) summonerLevel: number;
  @Prop({ required: true }) summonerName: string;
  @Prop({ required: true }) teamEarlySurrendered: boolean;
  @Prop({ required: true }) teamId: number;
  @Prop({ required: false }) teamPosition: Position;
  @Prop({ required: true }) timeCCingOthers: number;
  @Prop({ required: true }) timePlayed: number;
  @Prop({ required: true }) totalDamageDealt: number;
  @Prop({ required: true }) totalDamageDealtToChampions: number;
  @Prop({ required: true }) totalDamageShieldedOnTeammates: number;
  @Prop({ required: true }) totalDamageTaken: number;
  @Prop({ required: true }) totalHeal: number;
  @Prop({ required: true }) totalHealsOnTeammates: number;
  @Prop({ required: true }) totalMinionsKilled: number;
  @Prop({ required: true }) totalTimeCCDealt: number;
  @Prop({ required: true }) totalTimeSpentDead: number;
  @Prop({ required: true }) totalUnitsHealed: number;
  @Prop({ required: true }) tripleKills: number;
  @Prop({ required: true }) trueDamageDealt: number;
  @Prop({ required: true }) trueDamageDealtToChampions: number;
  @Prop({ required: true }) trueDamageTaken: number;
  @Prop({ required: true }) turretKills: number;
  @Prop({ required: false }) turretTakedowns: number;
  @Prop({ required: false }) turretsLost: number;
  @Prop({ required: true }) unrealKills: number;
  @Prop({ required: true }) visionScore: number;
  @Prop({ required: true }) visionWardsBoughtInGame: number;
  @Prop({ required: true }) wardsKilled: number;
  @Prop({ required: true }) wardsPlaced: number;
  @Prop({ required: true }) win: boolean;
}

const ParticipantDtoSchema = SchemaFactory.createForClass(ParticipantDto);

type Description = 'primaryStyle' | 'subStyle';
type Position = '' | 'Invalid' | 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM' | 'UTILITY';
type Role = 'SOLO' | 'NONE' | 'CARRY' | 'SUPPORT';
type Lane = 'TOP' | 'JUNGLE' | 'MIDDLE' | 'BOTTOM';

@Schema()
class InfoDto {
  /** Unix timestamp for when the game is created(i.e., the loading screen). */
  @Prop({ required: true }) gameCreation: number;
  /** Game length in milliseconds. */
  @Prop({ required: true }) gameDuration: number;
  @Prop({ required: true, unique: true }) gameId: number;
  /** Refer to the Game Constants documentation. */
  @Prop({ required: true }) gameMode: string;
  @Prop({ required: true }) gameName: string;
  /** Unix timestamp for when match actually starts. */
  @Prop({ required: true }) gameStartTimestamp: number;
  @Prop({ required: true }) gameType: string;
  /** The first two parts can be used to determine the patch a game was played on. */
  @Prop({ required: true }) gameVersion: string;
  /** Refer to the Game Constants documentation. */
  @Prop({ required: true }) mapId: number;
  @Prop({ required: true, type: [ParticipantDtoSchema] }) participants: ParticipantDto[];
  /** Platform where the match was played. */
  @Prop({ required: true }) platformId: string;
  /** Refer to the Game Constants documentation. */
  @Prop({ required: true }) queueId: number;
  @Prop({ required: true, type: [TeamDtoSchema] }) teams: TeamDto[];
  /** Tournament code used to generate the match. */
  @Prop({ required: false }) tournamentCode: string;
}

const InfoDtoSchema = SchemaFactory.createForClass(InfoDto);

@Schema()
export class MatchV5 {
  @Prop({ required: true, type: MetadataDtoSchema })
  metadata: MetadataDto;

  @Prop({ required: true, type: InfoDtoSchema })
  info: InfoDto;
}


export const MatchV5Schema = SchemaFactory.createForClass(MatchV5);
