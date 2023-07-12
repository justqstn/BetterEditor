// Better EDITOR от just_qstn
// v1
// All rights reversed - все права защищены





// Константы
const ADMIN = "9DE9DFD7D1F5C16A", BANNED = "";

// Переменные

// Создание команд
Teams.Add("players", "<i><B><size=38>И</size><size=30>гроки</size></B>\nbetter editor by just_qstn</i>", {g: 0.6, b: 0.6});
Teams.Add("builders", "<i><B><size=38>С</size><size=30>троители</size></B>\nbetter editor by just_qstn</i>", {g: 0.6});
let p_team = Teams.Get("players"), b_team = Teams.Get("builders");

// Настройки
BreackGraph.OnlyPlayerBlocksDmg = false;
BreackGraph.WeakBlocks = true;
BreackGraph.BreackAll = true;
Ui.GetContext().QuadsCount.Value = true;
Build.GetContext().BlocksSet.Value = BuildBlocksSet.AllClear;
Build.GetContext().CollapseChangeEnable.Value = true;
Build.GetContext().FlyEnable.Value = true;

// Интерфейс
LeaderBoard.PlayerLeaderBoardValues = [
	{
		Value: "rid",
		DisplayName: "<B>r</B>аid",
		ShortDisplayName: "<B>r</B>id"
	},
	{
		Value: "banned",
		DisplayName: "<B>z</B>абанен",
		ShortDisplayName: "<B>z</B>абанен"
	}
];

Ui.GetContext().TeamProp1.Value = {
	Team: "players", Prop: "hint"
};
Ui.GetContext().TeamProp2.Value = {
	Team: "builders", Prop: "hint"
};

p_team.Properties.Get("hint").Value = "<B>BETTER EDITOR</B><i>\nby just_qstn</i>";
b_team.Properties.Get("hint").Value = "<B>BETTER EDITOR</B><i>\nby just_qstn</i>";

// События
Teams.OnAddTeam.Add(function (t) {
	let bl = t.Id == "players" ? false : true;
	Build.GetContext(t).Pipette.Value = bl;
	Build.GetContext(t).FloodFill.Value = bl;
	Build.GetContext(t).FillQuad.Value = bl;
	Build.GetContext(t).RemoveQuad.Value = bl;
	Build.GetContext(t).BalkLenChange.Value = bl;
	Build.GetContext(t).SetSkyEnable.Value = bl;
	Build.GetContext(t).GenMapEnable.Value = bl;
	Build.GetContext(t).ChangeCameraPointsEnable.Value = bl;
	Build.GetContext(t).QuadChangeEnable.Value = bl;
	Build.GetContext(t).BuildModeEnable.Value = bl;
	Build.GetContext(t).RenameMapEnable.Value = bl;
	Build.GetContext(t).ChangeMapAuthorsEnable.Value = bl;
	Build.GetContext(t).LoadMapEnable.Value = bl;
	Build.GetContext(t).ChangeSpawnsEnable.Value = bl;
	Build.GetContext(t).BuildRangeEnable.Value = bl;
	Inventory.GetContext(t).Main.Value = bl;
	Inventory.GetContext(t).MainInfinity.Value = bl;
	Inventory.GetContext(t).Secondary.Value = bl;
	Inventory.GetContext(t).SecondaryInfinity.Value = bl;
	Inventory.GetContext(t).Melee.Value = bl;
	Inventory.GetContext(t).BuildInfinity.Value = bl;
	Inventory.GetContext(t).Build.Value = bl;
	Inventory.GetContext(t).Explosive.Value = bl;
	Inventory.GetContext(t).ExplosiveInfinity.Value = bl;
});

Teams.OnRequestJoinTeam.Add(function (p, t) {
	if (p.IdInRoom == 1) Properties.GetContext().Get("team" + p.Id).Value = "builders";
    p.Properties.Get("banned").Value = Properties.GetContext().Get("banned" + p.Id).Value || false;
	p.Properties.Get("rid").Value = p.IdInRoom;
	Teams.Get(Properties.GetContext().Get("team" + p.Id).Value || "players").Add(p);
});

Teams.OnPlayerChangeTeam.Add(function (p) {
    p.Spawns.Spawn();
	if (p.Properties.Get("banned").Value) p.Spawns.Despawn();
});

Players.OnPlayerDisconnected.Add(function(p) {
	Properties.GetContext().Get("banned" + p.Id).Value = p.Properties.Get("banned").Value;
	Properties.GetContext().Get("team" + p.Id).Value = p.Team.Id;
});

// Таймеры

// Зоны
let cmd_view = AreaViewService.GetContext().Get("cmd"), cmd_trigger = AreaPlayerTriggerService.Get("cmd");
cmd_view.Tags = ["cmd"];
cmd_view.Color = {r: 1, g: 1, b: 1}
cmd_view.Enable = true;
cmd_trigger.Tags = ["cmd"];
cmd_trigger.Enable = true;
cmd_trigger.OnEnter.Add(function(p, a) {
	try {
		eval(String(a.Name).split("$").join("."));
	} catch(e) { p.Ui.Hint.Value = e.name + "\n" + e.message; }
});

// Функции

function Ban(p) {
	if (p.Properties.Get("banned").Value) {
		p.Properties.Get("banned").Value = false;
		p.Spawns.Spawn();
	} else {
		p.Properties.Get("banned").Value = true;
		p.Spawns.Despawn();
	}
}

function Admin(p) {
	if (p.Team == p_team) b_team.Add(p);
	else p_team.Add(p);
}
